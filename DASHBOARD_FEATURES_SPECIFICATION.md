# 🎯 V-Izzy Customer Dashboard - Complete Feature Specification

**Version:** 1.0  
**Date:** November 4, 2025  
**Status:** Specification for Implementation

---

## 📊 **DASHBOARD OVERVIEW**

The customer dashboard (`dashboard.html`) will be the central hub where users access all V-Izzy features after logging in or completing payment.

---

## 🎨 **DASHBOARD LAYOUT**

### Main Structure:
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: Logo | Welcome User | Subscription Badge      │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ SIDEBAR  │           MAIN CONTENT AREA                 │
│          │                                              │
│ - Home   │  (Changes based on selected menu item)      │
│ - Upload │                                              │
│ - Scans  │                                              │
│ - AI Opt │                                              │
│ - Jobs   │                                              │
│ - Resumes│                                              │
│ - Account│                                              │
│ - Billing│                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

---

## 📋 **CORE FEATURES BY SECTION**

### 1. **Dashboard Home (Default View)**

#### Overview Cards:
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Resumes      │ Scans This   │ AI Uses      │ Current      │
│ Uploaded: 3  │ Month: 15/20 │ Left: 3/5    │ Plan: Basic  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**What It Shows:**
- ✅ Total resumes uploaded
- ✅ Scans used this month / limit (e.g., 15 out of 20)
- ✅ AI optimizations used / limit (e.g., 3 out of 5)
- ✅ Current subscription plan (Free/Basic/Pro)
- ✅ Subscription status (Active/Cancelled/Expired)
- ✅ Days until next billing

#### Quick Actions:
- 📤 **Upload New Resume** button (prominent)
- 🔍 **Quick Scan** button
- ✨ **AI Optimize** button
- 📊 **View All Scans** link

#### Recent Activity:
- Last 5 resume scans with scores
- Last AI optimization request
- Recent uploads

**What Users Can Do:**
- See their usage at a glance
- Quick access to main features
- Monitor subscription status
- Jump to any feature quickly

---

### 2. **Upload Resume Section**

#### Drag & Drop Interface:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         📁 Drag & Drop Resume Here                      │
│                                                         │
│              or [Choose File]                           │
│                                                         │
│         Supported: PDF, DOCX (Max 5MB)                  │
└─────────────────────────────────────────────────────────┘
```

#### Upload Options:
- 📄 **Resume Name:** (user can name it, e.g., "Tech Resume v2")
- 🎯 **Target Role:** (optional, e.g., "Software Engineer")
- 🏢 **Industry:** (optional, e.g., "Technology")

#### After Upload:
- ✅ Show success message
- ✅ Auto-redirect to scan results
- ✅ Save to "My Resumes" list

**What Users Can Do:**
- Upload new resumes easily
- Name/organize resumes
- Specify target role for better analysis
- Immediate scan after upload

---

### 3. **Resume Scans Section**

#### My Scans List:
```
┌─────────────────────────────────────────────────────────┐
│ Resume Name        │ Score │ Date       │ Actions      │
├────────────────────┼───────┼────────────┼──────────────┤
│ Tech Resume v2     │ 85/100│ Nov 3, 2025│ [View][Rescan]│
│ Marketing Resume   │ 72/100│ Nov 1, 2025│ [View][Rescan]│
│ Old Resume         │ 68/100│ Oct 29,2025│ [View][Delete]│
└─────────────────────────────────────────────────────────┘
```

#### Scan Details View (When clicking "View"):
```
┌─────────────────────────────────────────────────────────┐
│                    RESUME: Tech Resume v2               │
│                    ATS SCORE: 85/100 ✅                 │
├─────────────────────────────────────────────────────────┤
│ 📊 Score Breakdown:                                     │
│   • Formatting:    90/100 ✅                            │
│   • Keywords:      85/100 ✅                            │
│   • Content:       82/100 ⚠️                            │
│   • Structure:     88/100 ✅                            │
│   • Achievements:  80/100 ⚠️                            │
├─────────────────────────────────────────────────────────┤
│ 🎯 Detected Skills (12):                                │
│   [JavaScript] [React] [Node.js] [AWS] [Docker] ...    │
├─────────────────────────────────────────────────────────┤
│ ⚠️ Missing Keywords (5):                                │
│   [CI/CD] [Kubernetes] [Microservices] [GraphQL] ...   │
├─────────────────────────────────────────────────────────┤
│ 💡 Insights & Recommendations:                          │
│   ✅ Strong technical skills section                    │
│   ⚠️ Consider adding more quantified achievements       │
│   ⚠️ Add cloud architecture experience                  │
│   ✅ Good formatting and structure                      │
├─────────────────────────────────────────────────────────┤
│ [⚡ AI Optimize This Resume] [📥 Download Report]       │
└─────────────────────────────────────────────────────────┘
```

**What Users Can Do:**
- View all previous scans
- Compare scores over time
- Re-scan same resume after edits
- Jump to AI optimization
- Download detailed PDF report

---

### 4. **AI Optimization Section** (PAID FEATURE)

#### Access Control:
- **Free Users:** See upgrade prompt
- **Basic Users:** 5 optimizations per month
- **Pro Users:** Unlimited optimizations

#### AI Optimization Interface:
```
┌─────────────────────────────────────────────────────────┐
│           ✨ AI-Powered Resume Optimization             │
├─────────────────────────────────────────────────────────┤
│ Select Resume: [Dropdown: Tech Resume v2        ▼]     │
│ Target Role:   [Software Engineer               ]      │
│ Company:       [Optional: Google, Amazon, etc.  ]      │
│                                                         │
│              [🚀 Generate AI Optimization]              │
└─────────────────────────────────────────────────────────┘
```

#### After AI Processing:
```
┌─────────────────────────────────────────────────────────┐
│                  AI OPTIMIZATION RESULTS                │
├─────────────────────────────────────────────────────────┤
│ 📈 Overall Assessment:                                  │
│   Your resume shows strong technical skills but could   │
│   benefit from more quantified achievements and...      │
├─────────────────────────────────────────────────────────┤
│ 💪 Key Strengths:                                       │
│   • Strong technical vocabulary                         │
│   • Good use of action verbs                           │
│   • Clear job progression                              │
├─────────────────────────────────────────────────────────┤
│ ⚠️ Critical Issues:                                     │
│   • Lack of metrics in achievements                    │
│   • Missing industry keywords                          │
│   • Vague responsibility descriptions                  │
├─────────────────────────────────────────────────────────┤
│ 🔧 Section-by-Section Improvements:                     │
│                                                         │
│ EXPERIENCE - Current:                                   │
│ "Managed team projects and deliverables"               │
│                                                         │
│ ✨ AI Suggested:                                        │
│ "Led cross-functional team of 8 engineers, delivering  │
│ 12 projects on-time with 95% stakeholder satisfaction, │
│ resulting in $2M revenue increase"                      │
│                                                         │
│ [✅ Apply This Change] [✏️ Edit] [❌ Reject]            │
│                                                         │
│ (Similar sections for each resume section...)          │
├─────────────────────────────────────────────────────────┤
│ 🎯 Keywords to Add:                                     │
│   [CI/CD] [Agile] [Microservices] [Leadership] ...    │
├─────────────────────────────────────────────────────────┤
│ [💾 Save Optimized Version] [📥 Download Both Versions]│
└─────────────────────────────────────────────────────────┘
```

**What Users Can Do:**
- Get AI-powered improvement suggestions
- See before/after comparisons
- Accept/reject individual changes
- Edit AI suggestions before applying
- Save optimized version as new resume
- Download side-by-side comparison PDF

**Backend Support:**
- ✅ OpenAI GPT-4 integration EXISTS
- ✅ `/api/resumes/:id/optimizations` endpoint EXISTS
- ✅ `/api/resumes/:id/rewrite-section` endpoint EXISTS
- ✅ AI cost tracking EXISTS
- ✅ Usage limit tracking EXISTS

**Just Needs:** Frontend UI to use existing backend!

---

### 5. **Job Matching Section** (FUTURE FEATURE)

#### Current Status:
- ❌ **NOT IMPLEMENTED** in backend
- ❌ No job database
- ❌ No job scraping/API integration
- ❌ No matching algorithm

#### What It WOULD Have (If Built):
```
┌─────────────────────────────────────────────────────────┐
│                    🎯 Job Matches                       │
├─────────────────────────────────────────────────────────┤
│ Your Resume: [Tech Resume v2           ▼]              │
│                                                         │
│ 🔍 Search Filters:                                      │
│   Location:   [Remote           ]                      │
│   Salary Min: [$100,000         ]                      │
│   Job Type:   [Full-time    ▼  ]                      │
│              [🔍 Find Matches]                          │
├─────────────────────────────────────────────────────────┤
│ 📊 Top Matches (based on your resume):                 │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ Senior Software Engineer - Google                 │ │
│ │ 📍 Mountain View, CA (Remote) | 💰 $150k-$200k    │ │
│ │ Match Score: 95% ⭐⭐⭐⭐⭐                          │ │
│ │                                                   │ │
│ │ Your Skills: JavaScript ✅ React ✅ Node.js ✅    │ │
│ │ Missing: Golang ⚠️ Kubernetes ⚠️                 │ │
│ │                                                   │ │
│ │ [📄 View Job] [💾 Save] [✉️ Apply]               │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ (More job listings...)                                  │
└─────────────────────────────────────────────────────────┘
```

**What Users WOULD Be Able To Do:**
- Search for jobs matching their resume
- See match percentage
- Identify skill gaps for each job
- Save favorite jobs
- Track applications
- Get alerts for new matches

**What's Needed to Build This:**
1. Job database or API integration (Indeed, LinkedIn, etc.)
2. Job scraping service or API subscription
3. Matching algorithm (compare resume skills to job requirements)
4. Saved jobs database table
5. Application tracking system
6. Email notifications for new matches

**Estimated Build Time:** 2-3 weeks for MVP

---

### 6. **My Resumes Section**

#### Resume Library:
```
┌─────────────────────────────────────────────────────────┐
│                   📁 My Resume Library                  │
├─────────────────────────────────────────────────────────┤
│ [+ Upload New Resume]                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 📄 Tech Resume v2                                 │ │
│ │ Last Scan: 85/100 ✅ | Uploaded: Nov 3, 2025     │ │
│ │                                                   │ │
│ │ [👁️ View] [🔍 Scan] [✨ AI Optimize]             │ │
│ │ [📥 Download] [✏️ Rename] [🗑️ Delete]            │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 📄 Marketing Resume                               │ │
│ │ Last Scan: 72/100 ⚠️ | Uploaded: Nov 1, 2025     │ │
│ │                                                   │ │
│ │ [👁️ View] [🔍 Scan] [✨ AI Optimize]             │ │
│ │ [📥 Download] [✏️ Rename] [🗑️ Delete]            │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ Storage: 2 of 5 resumes used (Basic Plan)              │
└─────────────────────────────────────────────────────────┘
```

**What Users Can Do:**
- View all uploaded resumes
- See latest ATS score for each
- Quick actions: scan, optimize, download
- Rename resumes for better organization
- Delete old resumes
- See storage usage vs. limit

---

### 7. **Account Settings Section**

#### Profile Tab:
```
┌─────────────────────────────────────────────────────────┐
│                  👤 Account Information                 │
├─────────────────────────────────────────────────────────┤
│ Name:         [John Doe                          ]     │
│ Email:        [john@example.com                  ] ✅   │
│               (Email verified)                          │
│                                                         │
│ Password:     [**********] [Change Password]            │
│                                                         │
│ [💾 Save Changes]                                       │
└─────────────────────────────────────────────────────────┘
```

#### Subscription Tab:
```
┌─────────────────────────────────────────────────────────┐
│                  💳 Subscription & Billing              │
├─────────────────────────────────────────────────────────┤
│ Current Plan:     Basic Plan ($9.99/month)              │
│ Status:           ✅ Active                             │
│ Next Billing:     December 3, 2025                      │
│ Payment Method:   •••• •••• •••• 4242 (Visa)           │
│                                                         │
│ Usage This Month:                                       │
│   • ATS Scans:    15 / 20 used                         │
│   • AI Optimize:  3 / 5 used                           │
│   • Resume Storage: 2 / 5 used                         │
│                                                         │
│ [⬆️ Upgrade to Pro] [🔄 Update Payment] [❌ Cancel]    │
└─────────────────────────────────────────────────────────┘
```

#### Notifications Tab:
```
┌─────────────────────────────────────────────────────────┐
│                  🔔 Notification Preferences            │
├─────────────────────────────────────────────────────────┤
│ Email Notifications:                                    │
│   ☑️ New job matches                                    │
│   ☑️ Resume scan completed                              │
│   ☑️ Monthly usage summary                              │
│   ☑️ Billing reminders                                  │
│   ☐ Marketing emails                                    │
│                                                         │
│ [💾 Save Preferences]                                   │
└─────────────────────────────────────────────────────────┘
```

**What Users Can Do:**
- Update profile information
- Change password
- Verify email address
- View subscription details
- See usage statistics
- Upgrade/downgrade plan
- Update payment method
- Cancel subscription
- Manage email preferences

---

### 8. **Billing Management Section**

#### Billing History:
```
┌─────────────────────────────────────────────────────────┐
│                    💰 Billing History                   │
├─────────────────────────────────────────────────────────┤
│ Date       │ Description      │ Amount  │ Status │ PDF │
├────────────┼──────────────────┼─────────┼────────┼─────┤
│ Nov 3, 2025│ Basic Plan       │ $9.99   │ Paid   │[📥] │
│ Oct 3, 2025│ Basic Plan       │ $9.99   │ Paid   │[📥] │
│ Sep 3, 2025│ Basic Plan       │ $9.99   │ Paid   │[📥] │
└─────────────────────────────────────────────────────────┘
```

#### Payment Methods:
```
┌─────────────────────────────────────────────────────────┐
│                   💳 Payment Methods                    │
├─────────────────────────────────────────────────────────┤
│ 💳 Visa ending in 4242                                  │
│    Expires: 12/2025                                     │
│    [✏️ Edit] [🗑️ Remove]                               │
│                                                         │
│ [+ Add New Payment Method]                              │
└─────────────────────────────────────────────────────────┘
```

**What Users Can Do:**
- View all past payments
- Download invoices (PDF)
- Manage payment methods
- Update credit card
- Add backup payment method

---

## 🎨 **VISUAL DESIGN ELEMENTS**

### Color Scheme:
- **Primary:** #667eea (Purple/Blue gradient)
- **Secondary:** #764ba2 (Deep Purple)
- **Success:** #48bb78 (Green)
- **Warning:** #f6ad55 (Orange)
- **Error:** #fc8181 (Red)
- **Background:** #f7fafc (Light Gray)
- **Cards:** #ffffff (White)

### Typography:
- **Font:** Poppins (same as homepage)
- **Headings:** 600-700 weight
- **Body:** 400-500 weight
- **Small text:** 300 weight

### Components:
- **Cards:** White background, subtle shadow, rounded corners
- **Buttons:** Gradient (primary), outlined (secondary)
- **Progress Bars:** For usage limits
- **Badges:** For plan types, status indicators
- **Icons:** Font Awesome icons throughout

---

## 📱 **RESPONSIVE DESIGN**

### Desktop (1200px+):
- Sidebar visible at all times
- 2-column layouts for cards
- Full-width tables

### Tablet (768px - 1199px):
- Collapsible sidebar
- 2-column card layouts
- Scrollable tables

### Mobile (< 768px):
- Hamburger menu for sidebar
- Single column layouts
- Card-based tables
- Touch-friendly buttons (min 44px)

---

## 🔐 **ACCESS CONTROL BY PLAN**

### Free Plan Users See:
- ✅ Dashboard home
- ✅ Upload resume (limit 1)
- ✅ View scans (3 per month)
- ✅ My resumes (1 resume max)
- ✅ Account settings
- ❌ AI Optimization (upgrade prompt)
- ❌ Job Matching (upgrade prompt)
- ❌ Unlimited features

### Basic Plan Users See:
- ✅ Everything in Free, plus:
- ✅ AI Optimization (5 per month)
- ✅ Upload up to 5 resumes
- ✅ 20 scans per month
- ✅ Billing management
- ⚠️ Job Matching (if built)

### Pro Plan Users See:
- ✅ Everything in Basic, plus:
- ✅ Unlimited AI optimizations
- ✅ Unlimited resume storage
- ✅ Unlimited scans
- ✅ Priority support badge
- ✅ Advanced analytics (if built)

---

## 🚀 **WHAT CAN BE BUILT IMMEDIATELY**

### Phase 1 - Core Dashboard (4-6 hours):
1. ✅ **Dashboard Home** - Overview cards, usage stats
2. ✅ **Upload Resume** - Drag & drop interface
3. ✅ **My Scans** - List and detailed view
4. ✅ **My Resumes** - Library with actions
5. ✅ **AI Optimization UI** - Connect to existing backend
6. ✅ **Account Settings** - Profile and subscription info

**Backend Support:** Already exists for all of these!

### Phase 2 - Enhanced Features (1-2 days):
7. ⏳ **Billing Management** - Payment history, methods
8. ⏳ **Usage Analytics** - Charts and graphs
9. ⏳ **Notifications** - In-app and email preferences
10. ⏳ **Help/Support** - Chat widget or contact form

### Phase 3 - Advanced Features (1-2 weeks):
11. ⏳ **Job Matching** - Requires new backend
12. ⏳ **Resume Builder** - Template-based builder
13. ⏳ **Interview Prep** - Question generation
14. ⏳ **Analytics Dashboard** - Performance tracking

---

## 📊 **TECHNICAL IMPLEMENTATION**

### Frontend Files Needed:
- `dashboard.html` - Main dashboard page
- `css/dashboard.css` - Dashboard-specific styles
- `js/dashboard.js` - Dashboard logic
- `js/resume-manager.js` - Resume operations
- `js/ai-optimizer.js` - AI optimization UI
- `js/usage-tracker.js` - Usage statistics

### Backend APIs Already Available:
- ✅ `GET /api/user/profile` - Get user info
- ✅ `GET /api/resumes` - List user's resumes
- ✅ `POST /api/resumes/upload` - Upload new resume
- ✅ `GET /api/resumes/:id` - Get specific resume
- ✅ `GET /api/resumes/:id/analysis` - Get ATS analysis
- ✅ `GET /api/resumes/:id/optimizations` - Get AI suggestions
- ✅ `POST /api/resumes/:id/rewrite-section` - AI rewrite
- ✅ `DELETE /api/resumes/:id` - Delete resume
- ✅ `GET /api/payments/subscription` - Get subscription
- ✅ `GET /api/payments/history` - Payment history
- ✅ `POST /api/payments/cancel-subscription` - Cancel

**Everything is ready on the backend side!**

---

## ✅ **RECOMMENDATION**

**BUILD PHASE 1 NOW** (4-6 hours):

This gives users:
- ✅ A place to land after payment
- ✅ Access to upload and scan features
- ✅ AI optimization capabilities
- ✅ Resume management
- ✅ Account control

**Result:**
- Paying customers get value
- No more 404 errors
- Professional user experience
- Ready to accept payments safely

---

## ❓ **QUESTIONS**

1. **Should I start building the dashboard now?**
2. **Any specific features you want prioritized?**
3. **Any design preferences or brand guidelines?**
4. **Do you want job matching in Phase 1 or later?**

**Let me know and I'll start implementing immediately!** 🚀
