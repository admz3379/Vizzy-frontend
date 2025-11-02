// ==============================================
// VIZZY API INTEGRATION MODULE
// ==============================================

// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://v-izzy.com/api',
    // For local development, uncomment:
    // BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 30000 // 30 seconds
};

// Authentication Token Management
const AuthManager = {
    getToken: () => localStorage.getItem('vizzy_auth_token'),
    setToken: (token) => localStorage.setItem('vizzy_auth_token', token),
    removeToken: () => localStorage.removeItem('vizzy_auth_token'),
    isAuthenticated: () => !!AuthManager.getToken()
};

// User Data Management
const UserManager = {
    getUser: () => {
        const user = localStorage.getItem('vizzy_user');
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem('vizzy_user', JSON.stringify(user)),
    removeUser: () => localStorage.removeItem('vizzy_user')
};

// ==============================================
// API REQUEST HANDLER
// ==============================================

async function apiRequest(endpoint, options = {}) {
    const {
        method = 'GET',
        body = null,
        requiresAuth = true,
        headers = {}
    } = options;

    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };

    // Add auth token if required
    if (requiresAuth) {
        const token = AuthManager.getToken();
        if (!token) {
            throw new Error('Authentication required. Please log in.');
        }
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions = {
        method,
        headers: requestHeaders
    };

    if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, requestOptions);
        
        // Handle non-JSON responses (like redirects)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (response.ok) {
                return { success: true };
            }
            throw new Error('Server error. Please try again.');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ==============================================
// AUTHENTICATION API
// ==============================================

const AuthAPI = {
    /**
     * Register new user
     */
    async register(email, password, name) {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: { email, password, name },
            requiresAuth: false
        });
        
        if (response.data && response.data.token) {
            AuthManager.setToken(response.data.token);
            UserManager.setUser(response.data.user);
        }
        
        return response;
    },

    /**
     * Login user
     */
    async login(email, password) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password },
            requiresAuth: false
        });
        
        if (response.data && response.data.token) {
            AuthManager.setToken(response.data.token);
            UserManager.setUser(response.data.user);
        }
        
        return response;
    },

    /**
     * Logout user
     */
    async logout() {
        try {
            await apiRequest('/auth/logout', {
                method: 'POST'
            });
        } finally {
            AuthManager.removeToken();
            UserManager.removeUser();
            window.location.href = '/';
        }
    },

    /**
     * Get current user profile
     */
    async getProfile() {
        const response = await apiRequest('/user/profile');
        if (response.data && response.data.user) {
            UserManager.setUser(response.data.user);
        }
        return response;
    }
};

// ==============================================
// PAYMENT API
// ==============================================

const PaymentAPI = {
    /**
     * Create checkout session for subscription
     * @param {string} planId - 'basic' or 'pro'
     */
    async createCheckout(planId) {
        if (!AuthManager.isAuthenticated()) {
            throw new Error('Please log in to subscribe');
        }

        const response = await apiRequest('/payments/create-checkout', {
            method: 'POST',
            body: { planId }
        });

        return response.data;
    },

    /**
     * Get current subscription status
     */
    async getSubscription() {
        const response = await apiRequest('/payments/subscription');
        return response.data.subscription;
    },

    /**
     * Get payment history
     */
    async getPaymentHistory() {
        const response = await apiRequest('/payments/history');
        return response.data.payments;
    },

    /**
     * Cancel subscription
     */
    async cancelSubscription() {
        const response = await apiRequest('/payments/cancel-subscription', {
            method: 'POST'
        });
        return response;
    }
};

// ==============================================
// RESUME API
// ==============================================

const ResumeAPI = {
    /**
     * Upload resume file
     */
    async upload(file) {
        const formData = new FormData();
        formData.append('resume', file);

        const token = AuthManager.getToken();
        const response = await fetch(`${API_CONFIG.BASE_URL}/resumes/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        return await response.json();
    },

    /**
     * Get user's resumes
     */
    async getResumes() {
        const response = await apiRequest('/resumes');
        return response.data.resumes;
    },

    /**
     * Get single resume
     */
    async getResume(resumeId) {
        const response = await apiRequest(`/resumes/${resumeId}`);
        return response.data.resume;
    },

    /**
     * Delete resume
     */
    async deleteResume(resumeId) {
        const response = await apiRequest(`/resumes/${resumeId}`, {
            method: 'DELETE'
        });
        return response;
    }
};

// ==============================================
// SCAN API
// ==============================================

const ScanAPI = {
    /**
     * Scan resume
     */
    async scanResume(resumeId, jobDescription = '') {
        const response = await apiRequest('/scan', {
            method: 'POST',
            body: { resumeId, jobDescription }
        });
        return response.data;
    },

    /**
     * Get scan results
     */
    async getScan(scanId) {
        const response = await apiRequest(`/scan/${scanId}`);
        return response.data.scan;
    },

    /**
     * Get all scans for a resume
     */
    async getResumeScans(resumeId) {
        const response = await apiRequest(`/scan/resume/${resumeId}`);
        return response.data.scans;
    }
};

// ==============================================
// OPTIMIZE API
// ==============================================

const OptimizeAPI = {
    /**
     * Optimize resume with AI
     */
    async optimizeResume(resumeId, jobDescription = '') {
        const response = await apiRequest('/optimize', {
            method: 'POST',
            body: { resumeId, jobDescription }
        });
        return response.data;
    },

    /**
     * Get optimization results
     */
    async getOptimization(optimizationId) {
        const response = await apiRequest(`/optimize/${optimizationId}`);
        return response.data.optimization;
    },

    /**
     * Get all optimizations for a resume
     */
    async getResumeOptimizations(resumeId) {
        const response = await apiRequest(`/optimize/resume/${resumeId}`);
        return response.data.optimizations;
    }
};

// ==============================================
// PAYMENT FLOW HELPERS
// ==============================================

const PaymentFlow = {
    /**
     * Subscribe to a plan (redirects to Stripe)
     */
    async subscribeToPlan(planId) {
        try {
            // Check if user is logged in
            if (!AuthManager.isAuthenticated()) {
                // Save intended plan and redirect to login
                sessionStorage.setItem('intended_plan', planId);
                window.location.href = '/login.html';
                return;
            }

            // Show loading state
            showLoading('Creating checkout session...');

            // Create checkout session
            const checkoutData = await PaymentAPI.createCheckout(planId);

            // Redirect to Stripe checkout
            window.location.href = checkoutData.checkoutUrl;
        } catch (error) {
            hideLoading();
            showError(error.message);
        }
    },

    /**
     * Verify payment after success redirect
     */
    async verifyPayment() {
        try {
            // Check if we have a session_id in URL
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');

            if (!sessionId) {
                throw new Error('No payment session found');
            }

            showLoading('Verifying payment...');

            // Get current subscription status
            const subscription = await PaymentAPI.getSubscription();

            hideLoading();

            if (subscription.subscription_status === 'active') {
                return {
                    success: true,
                    subscription
                };
            } else {
                throw new Error('Subscription not active yet. Please wait a moment and refresh.');
            }
        } catch (error) {
            hideLoading();
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Check subscription status
     */
    async checkSubscription() {
        if (!AuthManager.isAuthenticated()) {
            return { plan: 'free', status: 'inactive' };
        }

        try {
            const subscription = await PaymentAPI.getSubscription();
            return subscription;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return { plan: 'free', status: 'inactive' };
        }
    }
};

// ==============================================
// UI HELPERS
// ==============================================

function showLoading(message = 'Loading...') {
    // Create loading overlay if it doesn't exist
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p id="loading-message">${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    document.getElementById('loading-message').textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showError(message) {
    alert(`Error: ${message}`);
    // TODO: Replace with better error UI
}

function showSuccess(message) {
    alert(message);
    // TODO: Replace with better success UI
}

// ==============================================
// EXPORTS
// ==============================================

// Make APIs available globally
window.VizzyAPI = {
    Auth: AuthAPI,
    Payment: PaymentAPI,
    PaymentFlow: PaymentFlow,
    Resume: ResumeAPI,
    Scan: ScanAPI,
    Optimize: OptimizeAPI,
    AuthManager,
    UserManager
};

console.log('✅ Vizzy API module loaded');
