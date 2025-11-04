# V-Izzy Testing Instructions

## 🎯 What We Fixed

**CRITICAL FIX IMPLEMENTED**: The authentication system was looking for the wrong field name (`token` instead of `accessToken`).

**Status**: ✅ **FIXED** - Ready for testing

---

## 🧪 Test the Authentication Flow

### Test 1: Login
1. **Open**: https://v-izzy.com/login.html
2. **Open Console**: Press F12, click "Console" tab
3. **Enter credentials**: 
   - Email: (your test account)
   - Password: (your test password)
4. **Click**: "Sign In" button
5. **Expected result**:
   - Console shows: `✅ Token found in response.data.accessToken`
   - Console shows: `🎟️ Token stored: YES`
   - After 1.5 seconds: Redirects to `/dashboard.html`
   - Dashboard loads with your user data

### Test 2: Signup
1. **Open**: https://v-izzy.com/signup.html
2. **Open Console**: Press F12, click "Console" tab
3. **Enter details**:
   - Name: Test User
   - Email: test@example.com (use unique email)
   - Password: TestPass123!
4. **Click**: "Create Account" button
5. **Expected result**:
   - Console shows: `✅ Token found in response.data.accessToken`
   - Console shows: `🎟️ Token stored: YES`
   - After 1.5 seconds: Redirects to `/dashboard.html`
   - Dashboard loads with new user data

---

## 🔍 What to Look For

### ✅ Success Indicators
- No error messages
- Console shows token was found and stored
- Automatic redirect to dashboard
- Dashboard shows your name/email in header
- All dashboard sections are clickable

### ❌ Failure Indicators (Report These)
- Error message: "Authentication token not received"
- Console shows: `❌ No token in response`
- Stuck on login/signup page
- Redirects to homepage instead of dashboard
- Dashboard shows 404 error

---

## 📝 Testing Report Template

After testing, please report back with:

```
✅ Login Test:
- Status: PASS/FAIL
- Console output: (paste here)
- Screenshot: (optional)

✅ Signup Test:
- Status: PASS/FAIL  
- Console output: (paste here)
- Screenshot: (optional)

✅ Dashboard Access:
- Status: PASS/FAIL
- Dashboard loaded: YES/NO
- User data showing: YES/NO

Additional Notes:
(any issues or observations)
```

---

## 🚀 Next Tests (After Authentication Works)

Once authentication is confirmed working:

### Test 3: Resume Upload
1. Navigate to "Upload Resume" section
2. Try both:
   - Click "Browse Files" button → Select file → Upload
   - Drag & drop resume file onto upload area
3. Verify file appears in "Resumes" section

### Test 4: Payment Flow
1. From homepage, click "Get Started" on Basic plan
2. Fill out signup form
3. Click "Select Basic Plan" button
4. Should redirect to Stripe checkout at:
   - Basic: https://buy.stripe.com/fZuaEXfJv1RZaDZ3vu57W00
   - Pro: https://buy.stripe.com/5kQ14nfJv0NVeUfea857W01
5. Complete test payment (use Stripe test card: 4242 4242 4242 4242)
6. After success, should return to dashboard with upgraded plan

### Test 5: Dashboard Features
Test each dashboard section:
- ✅ Home - Shows stats and welcome
- ✅ Upload Resume - File upload works
- ✅ Scans - Shows scan history
- ✅ AI Optimize - Can optimize resumes
- ✅ Resumes - Lists all resumes
- ✅ Jobs - Job matching (Phase 2)
- ✅ Analytics - Usage analytics
- ✅ Account - Profile settings
- ✅ Billing - Payment history

---

## 🆘 Getting Help

If tests fail, provide:
1. **Full console output** (copy/paste all console logs)
2. **Screenshots** of any errors
3. **Which test failed** (Test 1, 2, 3, etc.)
4. **Browser and version** (e.g., Chrome 120, Firefox 121)

---

## 📊 Deployment Info

- **Frontend**: https://v-izzy.com
- **Backend API**: https://api.v-izzy.com/api
- **GitHub Repo**: https://github.com/admz3379/Vizzy-frontend
- **Last Deploy**: Commit d3da867 (authentication fix)

---

**Ready to test! Let me know how it goes! 🚀**
