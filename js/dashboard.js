// ==============================================
// VIZZY DASHBOARD - Main JavaScript
// ==============================================

console.log('🚀 Dashboard initializing...');

// ==============================================
// STATE MANAGEMENT
// ==============================================

const DashboardState = {
    user: null,
    subscription: null,
    resumes: [],
    scans: [],
    currentPage: 'home',
    usage: {
        scansUsed: 0,
        scansLimit: 20,
        aiUsed: 0,
        aiLimit: 5,
        resumesUsed: 0,
        resumesLimit: 5
    }
};

// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, initializing dashboard...');
    
    // Check authentication
    if (!window.VizzyAPI.AuthManager.isAuthenticated()) {
        console.log('❌ Not authenticated, redirecting to login');
        window.location.href = '/login.html';
        return;
    }
    
    // Initialize dashboard
    try {
        await initializeDashboard();
        setupEventListeners();
        console.log('✅ Dashboard initialized successfully');
    } catch (error) {
        console.error('❌ Dashboard initialization error:', error);
        showToast('Failed to initialize dashboard. Please refresh the page.', 'error');
    }
});

// ==============================================
// DASHBOARD INITIALIZATION
// ==============================================

async function initializeDashboard() {
    console.log('🔧 Initializing dashboard components...');
    
    showLoadingOverlay('Loading your dashboard...');
    
    try {
        // Load user profile
        await loadUserProfile();
        
        // Load subscription data
        await loadSubscriptionData();
        
        // Load usage statistics
        await loadUsageStats();
        
        // Load resumes
        await loadResumes();
        
        // Update UI
        updateDashboardUI();
        
        hideLoadingOverlay();
    } catch (error) {
        console.error('Initialization error:', error);
        hideLoadingOverlay();
        throw error;
    }
}

// ==============================================
// DATA LOADING FUNCTIONS
// ==============================================

async function loadUserProfile() {
    console.log('👤 Loading user profile...');
    try {
        const response = await window.VizzyAPI.Auth.getProfile();
        DashboardState.user = response.data.user;
        console.log('✅ User profile loaded:', DashboardState.user.email);
    } catch (error) {
        console.error('Failed to load user profile:', error);
        throw error;
    }
}

async function loadSubscriptionData() {
    console.log('💳 Loading subscription data...');
    try {
        const subscription = await window.VizzyAPI.Payment.getSubscription();
        DashboardState.subscription = subscription;
        console.log('✅ Subscription loaded:', subscription.subscription_plan);
        
        // Update usage limits based on plan
        if (subscription.subscription_plan === 'pro') {
            DashboardState.usage.scansLimit = 999; // Unlimited
            DashboardState.usage.aiLimit = 999; // Unlimited
            DashboardState.usage.resumesLimit = 999; // Unlimited
        } else if (subscription.subscription_plan === 'basic') {
            DashboardState.usage.scansLimit = 20;
            DashboardState.usage.aiLimit = 5;
            DashboardState.usage.resumesLimit = 5;
        }
    } catch (error) {
        console.error('Failed to load subscription:', error);
        // Set free plan defaults if error
        DashboardState.subscription = {
            subscription_plan: 'free',
            subscription_status: 'inactive'
        };
    }
}

async function loadUsageStats() {
    console.log('📊 Loading usage statistics...');
    try {
        // Get usage from user object
        if (DashboardState.user) {
            DashboardState.usage.scansUsed = DashboardState.user.scans_this_month || 0;
            DashboardState.usage.aiUsed = DashboardState.user.ai_optimizations_this_month || 0;
        }
        console.log('✅ Usage stats loaded');
    } catch (error) {
        console.error('Failed to load usage stats:', error);
    }
}

async function loadResumes() {
    console.log('📄 Loading resumes...');
    try {
        DashboardState.resumes = await window.VizzyAPI.Resume.getResumes();
        DashboardState.usage.resumesUsed = DashboardState.resumes.length;
        console.log(`✅ Loaded ${DashboardState.resumes.length} resumes`);
    } catch (error) {
        console.error('Failed to load resumes:', error);
        DashboardState.resumes = [];
    }
}

// ==============================================
// UI UPDATE FUNCTIONS
// ==============================================

function updateDashboardUI() {
    console.log('🎨 Updating dashboard UI...');
    
    // Update user info in header
    updateUserHeader();
    
    // Update subscription badge
    updateSubscriptionBadge();
    
    // Update stats cards
    updateStatsCards();
    
    // Update account page
    updateAccountPage();
    
    // Update billing page
    updateBillingPage();
    
    // Populate resume selects
    populateResumeSelects();
}

function updateUserHeader() {
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    
    if (DashboardState.user) {
        userNameEl.textContent = DashboardState.user.name || DashboardState.user.email.split('@')[0];
        
        // Create avatar with first letter of name
        const firstLetter = (DashboardState.user.name || DashboardState.user.email)[0].toUpperCase();
        userAvatarEl.innerHTML = firstLetter;
        userAvatarEl.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        userAvatarEl.style.color = '#fff';
    }
}

function updateSubscriptionBadge() {
    const badgeEl = document.getElementById('subscriptionBadge');
    const plan = DashboardState.subscription?.subscription_plan || 'free';
    
    let badgeHTML = '';
    if (plan === 'pro') {
        badgeHTML = '<i class="fas fa-crown"></i><span>Pro</span>';
        badgeEl.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else if (plan === 'basic') {
        badgeHTML = '<i class="fas fa-star"></i><span>Basic</span>';
        badgeEl.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
        badgeHTML = '<i class="fas fa-user"></i><span>Free</span>';
        badgeEl.style.background = '#cbd5e0';
        badgeEl.style.color = '#2d3748';
    }
    
    badgeEl.innerHTML = badgeHTML;
}

function updateStatsCards() {
    const { usage, resumes } = DashboardState;
    const plan = DashboardState.subscription?.subscription_plan || 'free';
    
    // Total Resumes
    document.getElementById('totalResumes').textContent = resumes.length;
    
    // Scans Used
    const scansText = plan === 'pro' ? `${usage.scansUsed} / ∞` : `${usage.scansUsed} / ${usage.scansLimit}`;
    document.getElementById('scansUsed').textContent = scansText;
    
    // AI Optimizations
    const aiText = plan === 'pro' ? `${usage.aiUsed} / ∞` : `${usage.aiUsed} / ${usage.aiLimit}`;
    document.getElementById('aiUsed').textContent = aiText;
    
    // Current Plan
    const planText = plan === 'pro' ? 'Pro' : plan === 'basic' ? 'Basic' : 'Free';
    document.getElementById('currentPlan').textContent = planText;
}

function updateAccountPage() {
    if (DashboardState.user) {
        document.getElementById('accountName').value = DashboardState.user.name || '';
        document.getElementById('accountEmail').value = DashboardState.user.email || '';
    }
    
    // Update subscription details
    const subscriptionDetailsEl = document.getElementById('subscriptionDetails');
    const sub = DashboardState.subscription;
    
    let detailsHTML = `
        <div class="info-row">
            <span class="info-label">Plan:</span>
            <span class="info-value">${sub?.subscription_plan?.toUpperCase() || 'FREE'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value ${sub?.subscription_status === 'active' ? 'status-active' : 'status-inactive'}">
                ${sub?.subscription_status?.toUpperCase() || 'INACTIVE'}
            </span>
        </div>
    `;
    
    if (sub?.subscription_plan !== 'free' && sub?.subscription_status === 'active') {
        detailsHTML += `
            <div class="info-row">
                <span class="info-label">Next Billing:</span>
                <span class="info-value">${sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}</span>
            </div>
        `;
    }
    
    if (sub?.subscription_plan === 'free') {
        detailsHTML += `
            <div class="upgrade-prompt">
                <p>Upgrade to unlock more features!</p>
                <a href="/pricing.html" class="btn-primary">View Plans</a>
            </div>
        `;
    }
    
    subscriptionDetailsEl.innerHTML = detailsHTML;
}

function updateBillingPage() {
    const sub = DashboardState.subscription;
    const billingSubEl = document.getElementById('billingSubscription');
    
    if (sub?.subscription_plan === 'free' || !sub) {
        billingSubEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-credit-card"></i>
                <p>No active subscription</p>
                <a href="/pricing.html" class="btn-primary">View Plans</a>
            </div>
        `;
    } else {
        const price = sub.subscription_plan === 'pro' ? '$24.99' : '$9.99';
        billingSubEl.innerHTML = `
            <div class="subscription-info-card">
                <h4>${sub.subscription_plan.toUpperCase()} Plan</h4>
                <p class="price">${price}/month</p>
                <p class="status">Status: <span class="${sub.subscription_status === 'active' ? 'status-active' : 'status-inactive'}">${sub.subscription_status.toUpperCase()}</span></p>
                ${sub.current_period_end ? `<p>Next billing: ${new Date(sub.current_period_end).toLocaleDateString()}</p>` : ''}
                <button class="btn-danger" onclick="cancelSubscription()">Cancel Subscription</button>
            </div>
        `;
    }
    
    // Load payment history
    loadPaymentHistory();
}

async function loadPaymentHistory() {
    const historyEl = document.getElementById('paymentHistory');
    
    try {
        const payments = await window.VizzyAPI.Payment.getPaymentHistory();
        
        if (!payments || payments.length === 0) {
            historyEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No payment history</p>
                </div>
            `;
            return;
        }
        
        let historyHTML = '<table class="payment-table"><thead><tr><th>Date</th><th>Amount</th><th>Status</th><th>Receipt</th></tr></thead><tbody>';
        
        payments.forEach(payment => {
            historyHTML += `
                <tr>
                    <td>${new Date(payment.created_at).toLocaleDateString()}</td>
                    <td>$${(payment.amount / 100).toFixed(2)}</td>
                    <td><span class="status-${payment.status}">${payment.status}</span></td>
                    <td>${payment.receipt_url ? `<a href="${payment.receipt_url}" target="_blank">View</a>` : 'N/A'}</td>
                </tr>
            `;
        });
        
        historyHTML += '</tbody></table>';
        historyEl.innerHTML = historyHTML;
    } catch (error) {
        console.error('Failed to load payment history:', error);
        historyEl.innerHTML = `<p class="error-message">Failed to load payment history</p>`;
    }
}

function populateResumeSelects() {
    // Populate AI Optimize resume select
    const optimizeSelect = document.getElementById('optimizeResumeSelect');
    optimizeSelect.innerHTML = '<option value="">Select a resume...</option>';
    
    DashboardState.resumes.forEach(resume => {
        const option = document.createElement('option');
        option.value = resume.id;
        option.textContent = resume.name || `Resume ${resume.id}`;
        optimizeSelect.appendChild(option);
    });
}

// ==============================================
// PAGE NAVIGATION
// ==============================================

function setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.dataset.page;
            navigateToPage(pageName);
        });
    });
    
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageName = btn.dataset.page;
            navigateToPage(pageName);
        });
    });
    
    // Mobile sidebar toggle
    document.getElementById('openSidebar')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('active');
    });
    
    document.getElementById('closeSidebar')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('active');
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Resume upload
    setupResumeUpload();
    
    // AI Optimization
    document.getElementById('generateOptimizationBtn')?.addEventListener('click', handleGenerateOptimization);
    
    // Account settings
    document.getElementById('updateProfileBtn')?.addEventListener('click', handleUpdateProfile);
    document.getElementById('changePasswordBtn')?.addEventListener('click', handleChangePassword);
}

function navigateToPage(pageName) {
    console.log(`📍 Navigating to: ${pageName}`);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-page="${pageName}"]`)?.classList.add('active');
    
    // Update page title
    const titles = {
        home: 'Dashboard',
        upload: 'Upload Resume',
        scans: 'My Scans',
        'ai-optimize': 'AI Optimization',
        resumes: 'My Resumes',
        jobs: 'Job Matches',
        analytics: 'Analytics',
        account: 'Account Settings',
        billing: 'Billing & Payments'
    };
    document.getElementById('pageTitle').textContent = titles[pageName] || 'Dashboard';
    
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('active');
    
    // Load page-specific data
    loadPageData(pageName);
    
    DashboardState.currentPage = pageName;
}

async function loadPageData(pageName) {
    switch (pageName) {
        case 'scans':
            await loadScansPage();
            break;
        case 'resumes':
            await loadResumesPage();
            break;
        case 'ai-optimize':
            await loadAIOptimizePage();
            break;
        case 'account':
            updateAccountPage();
            break;
        case 'billing':
            updateBillingPage();
            break;
    }
}

// ==============================================
// RESUME UPLOAD FUNCTIONALITY
// ==============================================

function setupResumeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('resumeFileInput');
    
    // Click to upload
    uploadArea.addEventListener('click', (e) => {
        // Don't trigger if clicking the button itself
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleResumeUpload(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleResumeUpload(file);
        }
    });
}

async function handleResumeUpload(file) {
    console.log('📤 Uploading resume:', file.name);
    
    // Validate file
    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
        showToast('Please upload a PDF or Word document', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
    }
    
    // Check usage limit
    const plan = DashboardState.subscription?.subscription_plan || 'free';
    if (plan === 'free' && DashboardState.resumes.length >= 1) {
        showToast('Free plan allows only 1 resume. Please upgrade to upload more.', 'error');
        return;
    }
    if (plan === 'basic' && DashboardState.resumes.length >= 5) {
        showToast('Basic plan limit reached (5 resumes). Please upgrade to Pro for unlimited storage.', 'error');
        return;
    }
    
    // Show progress
    const progressEl = document.getElementById('uploadProgress');
    const statusEl = document.getElementById('uploadStatus');
    const fillEl = document.getElementById('progressFill');
    
    progressEl.style.display = 'block';
    statusEl.textContent = 'Uploading...';
    fillEl.style.width = '0%';
    
    try {
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            if (progress <= 90) {
                fillEl.style.width = progress + '%';
            }
        }, 100);
        
        // Upload file
        const response = await window.VizzyAPI.Resume.upload(file);
        
        clearInterval(progressInterval);
        fillEl.style.width = '100%';
        statusEl.textContent = 'Upload complete!';
        
        showToast('Resume uploaded successfully!', 'success');
        
        // Reload resumes
        await loadResumes();
        populateResumeSelects();
        updateStatsCards();
        
        // Hide progress after 2 seconds
        setTimeout(() => {
            progressEl.style.display = 'none';
            fillEl.style.width = '0%';
        }, 2000);
        
        // Navigate to resumes page
        setTimeout(() => {
            navigateToPage('resumes');
        }, 2500);
        
    } catch (error) {
        console.error('Upload error:', error);
        progressEl.style.display = 'none';
        showToast(error.message || 'Upload failed. Please try again.', 'error');
    }
}

// ==============================================
// SCANS PAGE
// ==============================================

async function loadScansPage() {
    console.log('📊 Loading scans page...');
    const scansListEl = document.getElementById('scansList');
    
    scansListEl.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading scans...</p></div>';
    
    try {
        // Get all scans for all resumes
        let allScans = [];
        for (const resume of DashboardState.resumes) {
            try {
                const scans = await window.VizzyAPI.Scan.getResumeScans(resume.id);
                allScans = allScans.concat(scans.map(scan => ({ ...scan, resumeName: resume.name })));
            } catch (error) {
                console.error(`Failed to load scans for resume ${resume.id}:`, error);
            }
        }
        
        if (allScans.length === 0) {
            scansListEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No scans yet</p>
                    <button class="btn-primary" onclick="navigateToPage('upload')">Upload Resume</button>
                </div>
            `;
            return;
        }
        
        // Sort by date (newest first)
        allScans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        let scansHTML = '<div class="scans-grid">';
        allScans.forEach(scan => {
            scansHTML += createScanCard(scan);
        });
        scansHTML += '</div>';
        
        scansListEl.innerHTML = scansHTML;
        
        // Add click handlers for scan cards
        document.querySelectorAll('.scan-card').forEach(card => {
            card.addEventListener('click', () => {
                const scanId = card.dataset.scanId;
                showScanDetail(scanId);
            });
        });
        
    } catch (error) {
        console.error('Failed to load scans:', error);
        scansListEl.innerHTML = `<p class="error-message">Failed to load scans. Please try again.</p>`;
    }
}

function createScanCard(scan) {
    const score = scan.ats_score || 0;
    const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
    
    return `
        <div class="scan-card" data-scan-id="${scan.id}">
            <div class="scan-header">
                <h4>${scan.resumeName || 'Resume'}</h4>
                <span class="scan-date">${new Date(scan.created_at).toLocaleDateString()}</span>
            </div>
            <div class="scan-score" style="color: ${scoreColor}">
                <div class="score-circle" style="border-color: ${scoreColor}">
                    <span>${score}</span>
                </div>
                <p>ATS Score</p>
            </div>
            <div class="scan-footer">
                <button class="btn-secondary btn-sm">View Details</button>
            </div>
        </div>
    `;
}

async function showScanDetail(scanId) {
    console.log('👁️ Showing scan detail:', scanId);
    
    const modal = document.getElementById('scanDetailModal');
    const contentEl = document.getElementById('scanDetailContent');
    
    contentEl.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading scan details...</p></div>';
    modal.style.display = 'flex';
    
    try {
        const scan = await window.VizzyAPI.Scan.getScan(scanId);
        
        const score = scan.ats_score || 0;
        const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
        
        let detailHTML = `
            <div class="scan-detail">
                <div class="scan-score-large" style="border-color: ${scoreColor}; color: ${scoreColor}">
                    <span class="score-number">${score}</span>
                    <span class="score-label">ATS Score</span>
                </div>
                
                <div class="scan-insights">
                    <h4>Key Insights</h4>
                    <ul>
                        ${scan.insights?.map(insight => `<li>${insight}</li>`).join('') || '<li>No insights available</li>'}
                    </ul>
                </div>
                
                <div class="scan-skills">
                    <h4>Detected Skills</h4>
                    <div class="skills-tags">
                        ${scan.detected_skills?.map(skill => `<span class="skill-tag">${skill}</span>`).join('') || '<p>No skills detected</p>'}
                    </div>
                </div>
                
                ${scan.missing_keywords?.length > 0 ? `
                <div class="scan-missing">
                    <h4>Missing Keywords</h4>
                    <div class="keywords-tags">
                        ${scan.missing_keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="scan-actions">
                    <button class="btn-primary" onclick="optimizeFromScan(${scan.resume_id})">
                        <i class="fas fa-magic"></i> Optimize This Resume
                    </button>
                </div>
            </div>
        `;
        
        contentEl.innerHTML = detailHTML;
        
    } catch (error) {
        console.error('Failed to load scan detail:', error);
        contentEl.innerHTML = `<p class="error-message">Failed to load scan details</p>`;
    }
    
    // Close modal handler
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function optimizeFromScan(resumeId) {
    // Close modal
    document.getElementById('scanDetailModal').style.display = 'none';
    
    // Navigate to AI optimize page
    navigateToPage('ai-optimize');
    
    // Pre-select the resume
    setTimeout(() => {
        document.getElementById('optimizeResumeSelect').value = resumeId;
    }, 100);
}

// ==============================================
// RESUMES PAGE
// ==============================================

async function loadResumesPage() {
    console.log('📄 Loading resumes page...');
    const resumesListEl = document.getElementById('resumesList');
    
    if (DashboardState.resumes.length === 0) {
        resumesListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>No resumes uploaded yet</p>
                <button class="btn-primary" onclick="navigateToPage('upload')">Upload Your First Resume</button>
            </div>
        `;
        return;
    }
    
    let resumesHTML = '<div class="resumes-grid">';
    DashboardState.resumes.forEach(resume => {
        resumesHTML += createResumeCard(resume);
    });
    resumesHTML += '</div>';
    
    resumesListEl.innerHTML = resumesHTML;
}

function createResumeCard(resume) {
    return `
        <div class="resume-card">
            <div class="resume-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="resume-info">
                <h4>${resume.name || 'Untitled Resume'}</h4>
                <p class="resume-date">Uploaded: ${new Date(resume.created_at).toLocaleDateString()}</p>
                ${resume.ats_score ? `<p class="resume-score">ATS Score: <strong>${resume.ats_score}</strong></p>` : ''}
            </div>
            <div class="resume-actions">
                <button class="btn-secondary btn-sm" onclick="downloadResume(${resume.id})">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn-danger btn-sm" onclick="deleteResume(${resume.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
}

async function downloadResume(resumeId) {
    console.log('⬇️ Downloading resume:', resumeId);
    showToast('Download functionality coming soon!', 'info');
    // TODO: Implement download functionality
}

async function deleteResume(resumeId) {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
        return;
    }
    
    console.log('🗑️ Deleting resume:', resumeId);
    
    try {
        await window.VizzyAPI.Resume.deleteResume(resumeId);
        showToast('Resume deleted successfully', 'success');
        
        // Reload resumes
        await loadResumes();
        populateResumeSelects();
        updateStatsCards();
        loadResumesPage();
        
    } catch (error) {
        console.error('Delete error:', error);
        showToast(error.message || 'Failed to delete resume', 'error');
    }
}

// ==============================================
// AI OPTIMIZATION PAGE
// ==============================================

async function loadAIOptimizePage() {
    console.log('🤖 Loading AI optimize page...');
    // Page already initialized, just ensure resume select is populated
    populateResumeSelects();
}

async function handleGenerateOptimization() {
    const resumeId = document.getElementById('optimizeResumeSelect').value;
    const targetRole = document.getElementById('optimizeTargetRole').value;
    const company = document.getElementById('optimizeCompany').value;
    
    if (!resumeId) {
        showToast('Please select a resume', 'error');
        return;
    }
    
    // Check usage limit
    const plan = DashboardState.subscription?.subscription_plan || 'free';
    if (plan === 'free') {
        showToast('AI Optimization is only available for paid plans. Please upgrade!', 'error');
        return;
    }
    if (plan === 'basic' && DashboardState.usage.aiUsed >= 5) {
        showToast('Basic plan limit reached (5 optimizations/month). Upgrade to Pro for unlimited!', 'error');
        return;
    }
    
    console.log('🎨 Generating AI optimization...');
    
    const resultsEl = document.getElementById('optimizationResults');
    const btn = document.getElementById('generateOptimizationBtn');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    resultsEl.style.display = 'block';
    resultsEl.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Analyzing your resume with AI...</p></div>';
    
    try {
        const jobDescription = targetRole + (company ? ` at ${company}` : '');
        const optimization = await window.VizzyAPI.Optimize.optimizeResume(resumeId, jobDescription);
        
        // Update usage
        DashboardState.usage.aiUsed++;
        updateStatsCards();
        
        // Display results
        displayOptimizationResults(optimization);
        
        showToast('AI optimization complete!', 'success');
        
    } catch (error) {
        console.error('Optimization error:', error);
        showToast(error.message || 'Failed to generate optimization', 'error');
        resultsEl.style.display = 'none';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-magic"></i> Generate AI Optimization';
    }
}

function displayOptimizationResults(optimization) {
    const resultsEl = document.getElementById('optimizationResults');
    
    let resultsHTML = `
        <div class="optimization-content">
            <h3>AI Optimization Results</h3>
            
            ${optimization.section_improvements?.length > 0 ? `
            <div class="optimization-section">
                <h4><i class="fas fa-edit"></i> Section Improvements</h4>
                <div class="improvements-list">
                    ${optimization.section_improvements.map(imp => `
                        <div class="improvement-item">
                            <h5>${imp.section}</h5>
                            <p>${imp.suggestion}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${optimization.keyword_suggestions?.length > 0 ? `
            <div class="optimization-section">
                <h4><i class="fas fa-key"></i> Recommended Keywords</h4>
                <div class="keywords-tags">
                    ${optimization.keyword_suggestions.map(keyword => `
                        <span class="keyword-tag">${keyword}</span>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${optimization.achievement_rewrites?.length > 0 ? `
            <div class="optimization-section">
                <h4><i class="fas fa-trophy"></i> Achievement Rewrites</h4>
                <div class="rewrites-list">
                    ${optimization.achievement_rewrites.map(rewrite => `
                        <div class="rewrite-item">
                            <p class="original"><strong>Original:</strong> ${rewrite.original}</p>
                            <p class="improved"><strong>Improved:</strong> ${rewrite.improved}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${optimization.action_items?.length > 0 ? `
            <div class="optimization-section">
                <h4><i class="fas fa-tasks"></i> Action Items</h4>
                <ul class="action-items-list">
                    ${optimization.action_items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `;
    
    resultsEl.innerHTML = resultsHTML;
}

// ==============================================
// ACCOUNT SETTINGS
// ==============================================

async function handleUpdateProfile() {
    const name = document.getElementById('accountName').value;
    
    if (!name.trim()) {
        showToast('Please enter your name', 'error');
        return;
    }
    
    console.log('💾 Updating profile...');
    
    try {
        // TODO: Implement profile update API
        showToast('Profile update functionality coming soon!', 'info');
        
    } catch (error) {
        console.error('Update error:', error);
        showToast(error.message || 'Failed to update profile', 'error');
    }
}

async function handleChangePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all password fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    console.log('🔐 Changing password...');
    
    try {
        // TODO: Implement password change API
        showToast('Password change functionality coming soon!', 'info');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
    } catch (error) {
        console.error('Password change error:', error);
        showToast(error.message || 'Failed to change password', 'error');
    }
}

// ==============================================
// SUBSCRIPTION MANAGEMENT
// ==============================================

async function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
        return;
    }
    
    console.log('❌ Canceling subscription...');
    
    showLoadingOverlay('Canceling subscription...');
    
    try {
        await window.VizzyAPI.Payment.cancelSubscription();
        showToast('Subscription canceled successfully', 'success');
        
        // Reload subscription data
        await loadSubscriptionData();
        updateDashboardUI();
        
        hideLoadingOverlay();
        
    } catch (error) {
        console.error('Cancel error:', error);
        hideLoadingOverlay();
        showToast(error.message || 'Failed to cancel subscription', 'error');
    }
}

// ==============================================
// LOGOUT
// ==============================================

async function handleLogout() {
    console.log('👋 Logging out...');
    
    if (confirm('Are you sure you want to log out?')) {
        try {
            await window.VizzyAPI.Auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            window.VizzyAPI.AuthManager.removeToken();
            window.VizzyAPI.UserManager.removeUser();
            window.location.href = '/';
        }
    }
}

// ==============================================
// UI HELPER FUNCTIONS
// ==============================================

function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = document.getElementById('loadingMessage');
    messageEl.textContent = message;
    overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// ==============================================
// EXPOSE FUNCTIONS GLOBALLY
// ==============================================

window.navigateToPage = navigateToPage;
window.downloadResume = downloadResume;
window.deleteResume = deleteResume;
window.optimizeFromScan = optimizeFromScan;
window.cancelSubscription = cancelSubscription;

console.log('✅ Dashboard JavaScript loaded');
