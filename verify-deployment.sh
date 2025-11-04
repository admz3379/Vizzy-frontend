#!/bin/bash

# ============================================
# V-IZZY DEPLOYMENT VERIFICATION SCRIPT
# ============================================
# This script verifies that your deployment is working correctly
# Run this after deploying to production

echo "🔍 V-IZZY Deployment Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="${1:-https://v-izzy.com}"
BACKEND_URL="https://api.v-izzy.com"

echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo ""

# Counter for passed/failed tests
PASSED=0
FAILED=0

# Function to check URL
check_url() {
    local url=$1
    local description=$2
    local expected_code=${3:-200}
    
    echo -n "Checking $description... "
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response_code, expected $expected_code)"
        ((FAILED++))
        return 1
    fi
}

# Function to check if file exists in response
check_file_content() {
    local url=$1
    local description=$2
    local search_string=$3
    
    echo -n "Checking $description... "
    
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$search_string"; then
        echo -e "${GREEN}✓ PASS${NC} (content found)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (content not found)"
        ((FAILED++))
        return 1
    fi
}

echo "🌐 FRONTEND CHECKS"
echo "===================="

# Check main pages
check_url "$FRONTEND_URL" "Homepage" 200
check_url "$FRONTEND_URL/dashboard.html" "Dashboard" 200
check_url "$FRONTEND_URL/login.html" "Login page" 200
check_url "$FRONTEND_URL/signup.html" "Signup page" 200
check_url "$FRONTEND_URL/payment-success.html" "Payment Success page" 200

echo ""
echo "📄 DASHBOARD FILES"
echo "===================="

# Check if dashboard HTML loads correctly
check_file_content "$FRONTEND_URL/dashboard.html" "Dashboard HTML structure" "dashboard-container"

# Check if CSS loads
check_url "$FRONTEND_URL/css/dashboard.css" "Dashboard CSS" 200

# Check if JS loads
check_url "$FRONTEND_URL/js/dashboard.js" "Dashboard JavaScript" 200
check_url "$FRONTEND_URL/js/api.js" "API JavaScript" 200

echo ""
echo "🔧 BACKEND CHECKS"
echo "===================="

# Check backend health
check_url "$BACKEND_URL/health" "Backend health check" 200

# Check API base
check_url "$BACKEND_URL/api" "API base endpoint" 404

echo ""
echo "📊 DEPLOYMENT SUMMARY"
echo "===================="
echo ""

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$((PASSED * 100 / TOTAL))

echo "Total checks: $TOTAL"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "Success rate: $SUCCESS_RATE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}Your deployment is working correctly! 🎉${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test the full payment flow manually"
    echo "2. Test resume upload (drag & drop + button)"
    echo "3. Test AI optimization feature"
    echo "4. Test on mobile devices"
    echo "5. Announce to users!"
    exit 0
else
    echo -e "${RED}✗ SOME CHECKS FAILED${NC}"
    echo -e "${YELLOW}Please review the failed checks above and fix issues.${NC}"
    echo ""
    echo "Common solutions:"
    echo "- Clear CDN cache and redeploy"
    echo "- Verify file paths are correct"
    echo "- Check backend is running"
    echo "- Review deployment logs"
    exit 1
fi
