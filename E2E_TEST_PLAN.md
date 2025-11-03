# V-Izzy End-to-End Testing Plan

**Test Date:** November 3, 2025  
**Tester:** Software QA  
**Environment:** Production  
**Frontend URL:** https://v-izzy.com  
**Backend API:** https://api.v-izzy.com/api

---

## Test Objectives

1. Verify frontend-backend integration is working correctly
2. Test all user journeys (free user, authenticated user, payment flow)
3. Validate API endpoints are responsive and returning correct data
4. Check error handling and edge cases
5. Ensure UI/UX is functioning as expected

---

## Test Scenarios

### Test Suite 1: Frontend-Backend Connectivity
- [ ] TS1.1: Verify API base URL is correctly configured
- [ ] TS1.2: Test CORS configuration
- [ ] TS1.3: Verify backend health/status endpoint

### Test Suite 2: Free User Journey (Lead Magnet)
- [ ] TS2.1: Upload resume without authentication
- [ ] TS2.2: Verify quick-analysis endpoint responds
- [ ] TS2.3: Validate real ATS score is returned (not static 68)
- [ ] TS2.4: Check limited results (5 skills, 3 keywords, 3 insights)
- [ ] TS2.5: Verify upgrade messaging is displayed
- [ ] TS2.6: Upload different resume and verify different score
- [ ] TS2.7: Test with different file types (PDF, DOCX)
- [ ] TS2.8: Test file size limits
- [ ] TS2.9: Test invalid file types (should be rejected)

### Test Suite 3: Authentication System
- [ ] TS3.1: Test user registration endpoint
- [ ] TS3.2: Test login endpoint
- [ ] TS3.3: Verify JWT token storage
- [ ] TS3.4: Test authentication state management
- [ ] TS3.5: Test logout functionality
- [ ] TS3.6: Verify token expiration handling
- [ ] TS3.7: Test invalid credentials error handling

### Test Suite 4: Authenticated User Journey
- [ ] TS4.1: Login successfully
- [ ] TS4.2: Upload resume with authentication
- [ ] TS4.3: Verify full analysis is returned (no limitations)
- [ ] TS4.4: Check resume is stored in user account
- [ ] TS4.5: Verify all detected skills are shown
- [ ] TS4.6: Verify all missing keywords are shown
- [ ] TS4.7: Verify detailed insights are provided

### Test Suite 5: Payment Flow
- [ ] TS5.1: Click "Subscribe to Basic" without login
- [ ] TS5.2: Verify redirect to login page
- [ ] TS5.3: Verify plan is saved in sessionStorage
- [ ] TS5.4: Login after clicking subscribe
- [ ] TS5.5: Verify redirect to checkout with ?subscribe parameter
- [ ] TS5.6: Verify loading overlay is displayed
- [ ] TS5.7: Verify Stripe checkout session is created
- [ ] TS5.8: Test checkout redirect URL
- [ ] TS5.9: Verify payment success page functionality
- [ ] TS5.10: Test subscription status endpoint

### Test Suite 6: API Endpoints
- [ ] TS6.1: POST /api/resumes/quick-analysis (public)
- [ ] TS6.2: POST /api/auth/register
- [ ] TS6.3: POST /api/auth/login
- [ ] TS6.4: POST /api/auth/logout
- [ ] TS6.5: GET /api/user/profile
- [ ] TS6.6: POST /api/resumes/upload (authenticated)
- [ ] TS6.7: GET /api/resumes (list user resumes)
- [ ] TS6.8: POST /api/payments/create-checkout
- [ ] TS6.9: GET /api/payments/subscription
- [ ] TS6.10: POST /api/payments/cancel-subscription

### Test Suite 7: Different Resume Scoring
- [ ] TS7.1: Upload tech resume with strong keywords
- [ ] TS7.2: Upload marketing resume
- [ ] TS7.3: Upload sales resume
- [ ] TS7.4: Upload poorly formatted resume
- [ ] TS7.5: Verify each gets unique score
- [ ] TS7.6: Verify industry-specific keywords are detected

### Test Suite 8: Error Handling
- [ ] TS8.1: Test network failure scenarios
- [ ] TS8.2: Test API timeout handling
- [ ] TS8.3: Test invalid file upload
- [ ] TS8.4: Test file size exceeded
- [ ] TS8.5: Test authentication failures
- [ ] TS8.6: Test invalid API responses
- [ ] TS8.7: Test rate limiting behavior

### Test Suite 9: UI/UX Validation
- [ ] TS9.1: Verify loading states are shown
- [ ] TS9.2: Verify success/error messages are displayed
- [ ] TS9.3: Check mobile responsiveness
- [ ] TS9.4: Verify upgrade CTAs are visible
- [ ] TS9.5: Test navigation flows
- [ ] TS9.6: Verify animations and transitions

### Test Suite 10: Security & Performance
- [ ] TS10.1: Verify JWT tokens are properly secured
- [ ] TS10.2: Test CORS restrictions
- [ ] TS10.3: Verify file upload security
- [ ] TS10.4: Test rate limiting on public endpoints
- [ ] TS10.5: Check API response times
- [ ] TS10.6: Verify no sensitive data in responses

---

## Test Execution

### Automated Tests
- API integration tests
- Endpoint connectivity tests
- Response validation tests

### Manual Tests
- UI/UX flow tests
- Payment flow tests (Stripe test mode)
- Visual regression tests

---

## Test Data

### Sample Resumes
1. **Tech Resume** - Software Engineer with React, Node.js, AWS
2. **Marketing Resume** - Digital Marketing Manager with SEO, Analytics
3. **Sales Resume** - Business Development with CRM, Pipeline Management
4. **Poorly Formatted** - Minimal experience, no keywords, poor structure

### Test Users
- **Free User** - No authentication, quick analysis only
- **Authenticated Free User** - Signed up but no subscription
- **Basic Plan User** - Active $9.99/month subscription
- **Pro Plan User** - Active $24.99/month subscription

### Test Cards (Stripe Test Mode)
- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 9995
- 3D Secure: 4000 0025 0000 3155

---

## Success Criteria

### Critical (Must Pass)
- [ ] Backend API is accessible and healthy
- [ ] Quick analysis works without authentication
- [ ] Authentication endpoints function correctly
- [ ] Different resumes return different scores
- [ ] Payment checkout redirect works

### High Priority (Should Pass)
- [ ] All API endpoints return valid responses
- [ ] Error handling works properly
- [ ] UI displays results correctly
- [ ] File upload validation works

### Medium Priority (Nice to Have)
- [ ] Performance meets targets (< 2s response)
- [ ] All edge cases handled gracefully
- [ ] UI animations work smoothly

---

## Issues Tracking

### Blocker Issues
(None expected, but will document if found)

### Critical Issues
(Will document if found)

### Minor Issues
(Will document if found)

### Enhancement Suggestions
(Will document improvements)

---

## Test Results Summary
(To be filled after execution)

**Total Tests:** TBD  
**Passed:** TBD  
**Failed:** TBD  
**Blocked:** TBD  
**Pass Rate:** TBD%

---

## Next Steps
1. Execute automated API tests
2. Perform manual UI testing
3. Document all findings
4. Create detailed bug reports for any issues
5. Provide backend access recommendations
