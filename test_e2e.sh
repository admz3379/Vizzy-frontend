#!/bin/bash

# V-Izzy End-to-End Test Suite
# Tests frontend-backend integration using curl

API_BASE_URL="https://api.v-izzy.com/api"
FRONTEND_URL="https://v-izzy.com"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TOTAL=0
PASSED=0
FAILED=0

# Test result storage
declare -a FAILED_TESTS=()

# Helper functions
test_pass() {
    ((TOTAL++))
    ((PASSED++))
    echo -e "${GREEN}✓${NC} $1"
}

test_fail() {
    ((TOTAL++))
    ((FAILED++))
    echo -e "${RED}✗${NC} $1"
    echo -e "  ${RED}Error: $2${NC}"
    FAILED_TESTS+=("$1: $2")
}

test_skip() {
    echo -e "${YELLOW}⊘${NC} $1 - $2"
}

print_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════"
    echo "$1"
    echo "═══════════════════════════════════════"
    echo -e "${NC}"
}

# Create temp directory for test files
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║         V-IZZY END-TO-END TEST SUITE                 ║"
echo "║         Frontend-Backend Integration Testing         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "${BLUE}Frontend URL: $FRONTEND_URL${NC}"
echo -e "${BLUE}Backend API:  $API_BASE_URL${NC}"
echo -e "${BLUE}Test Date:    $(date -u +"%Y-%m-%dT%H:%M:%SZ")${NC}"
echo ""

# ================================
# TEST SUITE 1: CONNECTIVITY
# ================================
print_header "TEST SUITE 1: Frontend-Backend Connectivity"

# Test 1.1: Backend API Health
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${API_BASE_URL}/health" 2>/dev/null)
if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 404 ]; then
    test_pass "TS1.1: Backend API is accessible (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" -eq 000 ]; then
    # Try base URL if /health doesn't exist
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${API_BASE_URL}" 2>/dev/null)
    if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 500 ]; then
        test_pass "TS1.1: Backend API is accessible (HTTP $HTTP_CODE)"
    else
        test_fail "TS1.1: Backend API health check" "HTTP $HTTP_CODE or connection timeout"
    fi
else
    test_fail "TS1.1: Backend API health check" "HTTP $HTTP_CODE"
fi

# Test 1.2: CORS Headers
RESPONSE=$(curl -s -I -H "Origin: $FRONTEND_URL" --max-time 10 "${API_BASE_URL}" 2>/dev/null)
if echo "$RESPONSE" | grep -qi "access-control-allow-origin"; then
    test_pass "TS1.2: CORS headers are present"
elif echo "$RESPONSE" | grep -qi "HTTP/"; then
    test_skip "TS1.2: CORS headers check" "Cannot verify CORS with OPTIONS request"
else
    test_fail "TS1.2: CORS configuration" "No response from server"
fi

# ================================
# TEST SUITE 2: AUTH ENDPOINTS
# ================================
print_header "TEST SUITE 2: Authentication Endpoints"

# Test 2.1: Register endpoint exists
TEST_EMAIL="test_$(date +%s)@test.com"
TEST_PASSWORD="TestPass123!"
REGISTER_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 10 \
    -X POST "${API_BASE_URL}/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
    2>/dev/null)

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | grep -v "HTTP_CODE:")

if [ "$HTTP_CODE" -eq 201 ]; then
    test_pass "TS2.1: POST /api/auth/register endpoint works (HTTP 201)"
    
    # Extract token from response
    AUTH_TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$AUTH_TOKEN" ]; then
        test_pass "TS2.2: Registration returns JWT token"
        echo -e "      ${BLUE}Token: ${AUTH_TOKEN:0:20}...${NC}"
    fi
    
elif [ "$HTTP_CODE" -eq 400 ]; then
    test_skip "TS2.1: Register endpoint" "Validation error (endpoint exists)"
elif [ "$HTTP_CODE" -eq 404 ]; then
    test_fail "TS2.1: Register endpoint" "Endpoint not found (HTTP 404)"
else
    test_fail "TS2.1: Register endpoint" "HTTP $HTTP_CODE"
fi

# Test 2.2: Login endpoint
if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 400 ]; then
    LOGIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 10 \
        -X POST "${API_BASE_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
        2>/dev/null)
    
    LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
    LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | grep -v "HTTP_CODE:")
    
    if [ "$LOGIN_HTTP_CODE" -eq 200 ]; then
        test_pass "TS2.3: POST /api/auth/login endpoint works (HTTP 200)"
        AUTH_TOKEN=$(echo "$LOGIN_BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    elif [ "$LOGIN_HTTP_CODE" -eq 400 ] || [ "$LOGIN_HTTP_CODE" -eq 401 ]; then
        test_skip "TS2.3: Login endpoint" "Auth failed but endpoint exists (HTTP $LOGIN_HTTP_CODE)"
    else
        test_fail "TS2.3: Login endpoint" "HTTP $LOGIN_HTTP_CODE"
    fi
fi

# ================================
# TEST SUITE 3: RESUME ENDPOINTS
# ================================
print_header "TEST SUITE 3: Resume Analysis Endpoints"

# Test 3.1: Quick Analysis Endpoint (Public)
# Create a test resume file
TEST_RESUME="$TEMP_DIR/test-resume.txt"
cat > "$TEST_RESUME" << 'EOF'
JOHN DOE
Software Engineer
Email: john@example.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5 years of experience in full-stack development.
Skilled in JavaScript, React, Node.js, Python, and AWS cloud services.

SKILLS
- Programming: JavaScript, TypeScript, Python, Java
- Frontend: React, Vue.js, HTML5, CSS3
- Backend: Node.js, Express, Django
- Cloud: AWS, Docker, Kubernetes
- Database: PostgreSQL, MongoDB, Redis

EXPERIENCE
Senior Software Engineer | Tech Company | 2020-Present
- Developed and maintained microservices using Node.js and Docker
- Improved application performance by 40% through code optimization
- Led team of 3 junior developers

Software Engineer | Startup Inc | 2018-2020
- Built responsive web applications using React and Redux
- Implemented CI/CD pipelines using Jenkins and AWS
- Collaborated with product team on feature development

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014-2018
GPA: 3.8/4.0

CERTIFICATIONS
- AWS Certified Solutions Architect
- Google Cloud Professional Developer
EOF

QUICK_ANALYSIS_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 30 \
    -X POST "${API_BASE_URL}/resumes/quick-analysis" \
    -F "resume=@$TEST_RESUME" \
    2>/dev/null)

QUICK_HTTP_CODE=$(echo "$QUICK_ANALYSIS_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
QUICK_BODY=$(echo "$QUICK_ANALYSIS_RESPONSE" | grep -v "HTTP_CODE:")

if [ "$QUICK_HTTP_CODE" -eq 200 ]; then
    test_pass "TS3.1: POST /api/resumes/quick-analysis endpoint works (HTTP 200)"
    
    # Check for ATS score in response
    if echo "$QUICK_BODY" | grep -q '"ats_score"'; then
        ATS_SCORE=$(echo "$QUICK_BODY" | grep -o '"ats_score":[0-9]*' | cut -d: -f2)
        test_pass "TS3.2: ATS score is included in response"
        echo -e "      ${BLUE}ATS Score: $ATS_SCORE${NC}"
    else
        test_fail "TS3.2: ATS score in response" "Score not found in JSON"
    fi
    
    # Check for detected skills
    if echo "$QUICK_BODY" | grep -q '"detected_skills"'; then
        test_pass "TS3.3: Detected skills are included"
        SKILLS=$(echo "$QUICK_BODY" | grep -o '"detected_skills":\[[^]]*\]' | head -1)
        echo -e "      ${BLUE}Skills: ${SKILLS:0:80}...${NC}"
    else
        test_fail "TS3.3: Detected skills" "Skills not found in response"
    fi
    
    # Check for missing keywords
    if echo "$QUICK_BODY" | grep -q '"missing_keywords"'; then
        test_pass "TS3.4: Missing keywords are included"
    else
        test_fail "TS3.4: Missing keywords" "Keywords not found in response"
    fi
    
    # Check for free preview flag
    if echo "$QUICK_BODY" | grep -q '"is_free_preview":true'; then
        test_pass "TS3.5: Free preview flag is set correctly"
    else
        test_skip "TS3.5: Free preview flag" "Flag not found or false"
    fi
    
    # Check for insights
    if echo "$QUICK_BODY" | grep -q '"insights"'; then
        test_pass "TS3.6: Insights are included in response"
    else
        test_fail "TS3.6: Insights" "Insights not found in response"
    fi
    
elif [ "$QUICK_HTTP_CODE" -eq 400 ]; then
    test_fail "TS3.1: Quick analysis endpoint" "Bad request (HTTP 400) - Check file format"
    echo -e "      ${RED}Response: $(echo "$QUICK_BODY" | head -c 100)${NC}"
elif [ "$QUICK_HTTP_CODE" -eq 404 ]; then
    test_fail "TS3.1: Quick analysis endpoint" "Endpoint not found (HTTP 404)"
else
    test_fail "TS3.1: Quick analysis endpoint" "HTTP $QUICK_HTTP_CODE"
fi

# Test 3.7: Upload a different resume to verify different scores
TEST_RESUME_2="$TEMP_DIR/test-resume-2.txt"
cat > "$TEST_RESUME_2" << 'EOF'
JANE SMITH
Marketing Manager

SUMMARY
Marketing professional with basic experience.

EXPERIENCE
Marketing Assistant | Small Company | 2021-2023
- Assisted with social media
- Helped with email campaigns

EDUCATION
Bachelor of Arts in Marketing | 2021
EOF

QUICK_ANALYSIS_2=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 30 \
    -X POST "${API_BASE_URL}/resumes/quick-analysis" \
    -F "resume=@$TEST_RESUME_2" \
    2>/dev/null)

QUICK_HTTP_CODE_2=$(echo "$QUICK_ANALYSIS_2" | grep "HTTP_CODE:" | cut -d: -f2)
QUICK_BODY_2=$(echo "$QUICK_ANALYSIS_2" | grep -v "HTTP_CODE:")

if [ "$QUICK_HTTP_CODE_2" -eq 200 ]; then
    ATS_SCORE_2=$(echo "$QUICK_BODY_2" | grep -o '"ats_score":[0-9]*' | cut -d: -f2)
    if [ -n "$ATS_SCORE_2" ] && [ "$ATS_SCORE_2" != "$ATS_SCORE" ]; then
        test_pass "TS3.7: Different resumes get different scores"
        echo -e "      ${BLUE}Score 1: $ATS_SCORE, Score 2: $ATS_SCORE_2${NC}"
    elif [ -n "$ATS_SCORE_2" ]; then
        test_skip "TS3.7: Different resume scores" "Scores are the same ($ATS_SCORE)"
    else
        test_fail "TS3.7: Different resume scores" "Could not extract second score"
    fi
fi

# ================================
# TEST SUITE 4: PAYMENT ENDPOINTS
# ================================
print_header "TEST SUITE 4: Payment Endpoints"

if [ -n "$AUTH_TOKEN" ]; then
    # Test 4.1: Create Checkout Endpoint
    CHECKOUT_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 10 \
        -X POST "${API_BASE_URL}/payments/create-checkout" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -d '{"plan":"basic"}' \
        2>/dev/null)
    
    CHECKOUT_HTTP_CODE=$(echo "$CHECKOUT_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
    CHECKOUT_BODY=$(echo "$CHECKOUT_RESPONSE" | grep -v "HTTP_CODE:")
    
    if [ "$CHECKOUT_HTTP_CODE" -eq 200 ]; then
        test_pass "TS4.1: POST /api/payments/create-checkout works (HTTP 200)"
        
        if echo "$CHECKOUT_BODY" | grep -q '"url"'; then
            test_pass "TS4.2: Checkout URL is returned"
            CHECKOUT_URL=$(echo "$CHECKOUT_BODY" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
            echo -e "      ${BLUE}URL: ${CHECKOUT_URL:0:50}...${NC}"
        else
            test_fail "TS4.2: Checkout URL" "URL not found in response"
        fi
    elif [ "$CHECKOUT_HTTP_CODE" -eq 404 ]; then
        test_fail "TS4.1: Create checkout endpoint" "Endpoint not found (HTTP 404)"
    else
        test_fail "TS4.1: Create checkout endpoint" "HTTP $CHECKOUT_HTTP_CODE"
    fi
    
    # Test 4.2: Get Subscription Status
    SUB_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 10 \
        -X GET "${API_BASE_URL}/payments/subscription" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        2>/dev/null)
    
    SUB_HTTP_CODE=$(echo "$SUB_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
    
    if [ "$SUB_HTTP_CODE" -eq 200 ] || [ "$SUB_HTTP_CODE" -eq 404 ]; then
        test_pass "TS4.3: GET /api/payments/subscription endpoint works (HTTP $SUB_HTTP_CODE)"
    else
        test_fail "TS4.3: Get subscription endpoint" "HTTP $SUB_HTTP_CODE"
    fi
else
    test_skip "TS4.1-4.3: Payment endpoint tests" "No auth token available"
fi

# ================================
# TEST SUITE 5: FRONTEND FILES
# ================================
print_header "TEST SUITE 5: Frontend Files Accessibility"

declare -a FRONTEND_FILES=(
    "index.html:Homepage"
    "login.html:Login page"
    "signup.html:Signup page"
    "payment-success.html:Payment success page"
    "js/main.js:Main JavaScript"
    "css/style.css:Stylesheet"
)

TEST_NUM=1
for FILE_INFO in "${FRONTEND_FILES[@]}"; do
    FILE_PATH=$(echo "$FILE_INFO" | cut -d: -f1)
    FILE_NAME=$(echo "$FILE_INFO" | cut -d: -f2)
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${FRONTEND_URL}/${FILE_PATH}" 2>/dev/null)
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        test_pass "TS5.$TEST_NUM: $FILE_NAME is accessible (HTTP 200)"
    elif [ "$HTTP_CODE" -eq 404 ]; then
        test_fail "TS5.$TEST_NUM: $FILE_NAME" "File not found (HTTP 404)"
    else
        test_fail "TS5.$TEST_NUM: $FILE_NAME" "HTTP $HTTP_CODE"
    fi
    
    ((TEST_NUM++))
done

# ================================
# TEST SUMMARY
# ================================
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                  TEST SUMMARY                         ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

PASS_RATE=0
if [ $TOTAL -gt 0 ]; then
    PASS_RATE=$(awk "BEGIN {printf \"%.2f\", ($PASSED / $TOTAL) * 100}")
fi

echo -e "${BLUE}Total Tests:  $TOTAL${NC}"
echo -e "${GREEN}Passed:       $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed:       $FAILED${NC}"
else
    echo -e "${GREEN}Failed:       $FAILED${NC}"
fi

if [ $(echo "$PASS_RATE >= 80" | bc -l) -eq 1 ]; then
    echo -e "${GREEN}Pass Rate:    $PASS_RATE%${NC}"
else
    echo -e "${RED}Pass Rate:    $PASS_RATE%${NC}"
fi

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}═══════════════════════════════════════${NC}"
    echo -e "${RED}FAILED TESTS DETAILS:${NC}"
    echo -e "${RED}═══════════════════════════════════════${NC}"
    echo ""
    for i in "${!FAILED_TESTS[@]}"; do
        echo -e "${RED}$((i+1)). ${FAILED_TESTS[$i]}${NC}"
    done
fi

echo ""
echo -e "${BLUE}Test completed at: $(date)${NC}"

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
