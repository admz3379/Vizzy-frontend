// API Configuration
const API_BASE_URL = 'https://v-izzy.com/api';
let authToken = localStorage.getItem('vizzy_auth_token');

// ==============================================
// VIZZY - Main JavaScript
// ==============================================

// Smooth scroll functionality
function scrollToScanner() {
    const scanner = document.getElementById('scanner');
    scanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Initialize file upload functionality
    initFileUpload();
    
    // Add scroll effects
    initScrollEffects();
});

// ==============================================
// FILE UPLOAD & SCANNER FUNCTIONALITY
// ==============================================

function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const scanningAnimation = document.getElementById('scanningAnimation');
    const scanResults = document.getElementById('scanResults');
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragging');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragging');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragging');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            handleFileUpload(fileInput.files[0]);
        }
    });
    
    // Click on upload area to trigger file input
    uploadArea.addEventListener('click', function(e) {
        if (e.target !== uploadArea && !uploadArea.contains(e.target)) return;
        fileInput.click();
    });
}

function handleFileUpload(file) {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or DOCX file');
        return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    // Show scanning animation
    showScanningAnimation();
    
    // Simulate scanning process (2-3 seconds)
    setTimeout(function() {
        showScanResults();
    }, 2500);
}

function showScanningAnimation() {
    const uploadArea = document.getElementById('uploadArea');
    const scanningAnimation = document.getElementById('scanningAnimation');
    
    uploadArea.style.display = 'none';
    scanningAnimation.style.display = 'block';
}

function showScanResults() {
    const scanningAnimation = document.getElementById('scanningAnimation');
    const scanResults = document.getElementById('scanResults');
    
    scanningAnimation.style.display = 'none';
    scanResults.style.display = 'block';
    
    // Animate the score
    animateScore(68); // Demo score
}

function animateScore(targetScore) {
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreCircle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 90; // radius = 90
    
    // Animate number
    let currentScore = 0;
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = targetScore / steps;
    const stepDuration = duration / steps;
    
    const numberInterval = setInterval(function() {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(numberInterval);
        }
        scoreNumber.textContent = Math.round(currentScore);
    }, stepDuration);
    
    // Animate circle
    const offset = circumference - (targetScore / 100) * circumference;
    setTimeout(function() {
        scoreCircle.style.strokeDashoffset = offset;
    }, 100);
}

function resetScanner() {
    const uploadArea = document.getElementById('uploadArea');
    const scanningAnimation = document.getElementById('scanningAnimation');
    const scanResults = document.getElementById('scanResults');
    const fileInput = document.getElementById('fileInput');
    
    // Reset file input
    fileInput.value = '';
    
    // Reset displays
    uploadArea.style.display = 'block';
    scanningAnimation.style.display = 'none';
    scanResults.style.display = 'none';
    
    // Reset score animation
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.style.strokeDashoffset = 565;
    
    // Scroll back to scanner
    scrollToScanner();
}

// ==============================================
// SCROLL EFFECTS
// ==============================================

function initScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.15}s`;
        observer.observe(card);
    });
}

// ==============================================
// DEMO INTERACTIONS
// ==============================================

// ==============================================
// PAYMENT INTEGRATION
// ==============================================

// Subscribe to Basic Plan
async function subscribeToBasic() {
    if (typeof window.VizzyAPI === 'undefined') {
        alert('Payment system is loading. Please try again in a moment.');
        return;
    }
    
    try {
        await window.VizzyAPI.PaymentFlow.subscribeToPlan('basic');
    } catch (error) {
        console.error('Subscription error:', error);
        alert('Error: ' + error.message);
    }
}

// Subscribe to Pro Plan
async function subscribeToPro() {
    if (typeof window.VizzyAPI === 'undefined') {
        alert('Payment system is loading. Please try again in a moment.');
        return;
    }
    
    try {
        await window.VizzyAPI.PaymentFlow.subscribeToPlan('pro');
    } catch (error) {
        console.error('Subscription error:', error);
        alert('Error: ' + error.message);
    }
}

// Check if user is logged in and update UI
function updateUIForAuthState() {
    if (typeof window.VizzyAPI === 'undefined') return;
    
    const signInButton = document.querySelector('.btn-secondary');
    if (!signInButton) return;
    
    if (window.VizzyAPI.AuthManager.isAuthenticated()) {
        const user = window.VizzyAPI.UserManager.getUser();
        signInButton.textContent = user?.email || 'Dashboard';
        signInButton.onclick = () => window.location.href = '/dashboard.html';
    } else {
        signInButton.textContent = 'Sign In';
        signInButton.onclick = () => window.location.href = '/login.html';
    }
}

// Check subscription status and show badge
async function checkAndDisplaySubscription() {
    if (typeof window.VizzyAPI === 'undefined') return;
    if (!window.VizzyAPI.AuthManager.isAuthenticated()) return;
    
    try {
        const subscription = await window.VizzyAPI.PaymentFlow.checkSubscription();
        if (subscription.plan !== 'free' && subscription.subscription_status === 'active') {
            // Show subscription badge in navbar
            const logo = document.querySelector('.logo');
            if (logo && !document.querySelector('.subscription-badge')) {
                const badge = document.createElement('span');
                badge.className = 'subscription-badge';
                badge.textContent = subscription.plan.toUpperCase();
                badge.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-left: 8px; font-weight: 600;';
                logo.appendChild(badge);
            }
        }
    } catch (error) {
        console.error('Error checking subscription:', error);
    }
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

// Smooth scroll for all internal links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add hover effect sounds (optional enhancement)
function addHoverEffects() {
    const buttons = document.querySelectorAll('button:not(.mobile-menu-btn)');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.25s ease-out';
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    addHoverEffects();
    
    // Add animation delays to stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.animation = `fadeInUp 0.8s ease-out ${0.8 + (index * 0.2)}s forwards`;
    });
    
    // Update UI based on auth state
    setTimeout(() => {
        updateUIForAuthState();
        checkAndDisplaySubscription();
    }, 100);
});

// ==============================================
// PERFORMANCE OPTIMIZATIONS
// ==============================================

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Add any scroll-based calculations here
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// ==============================================
// ANALYTICS (Placeholder)
// ==============================================

// Track button clicks
function trackEvent(eventName, eventData) {
    // In production, integrate with Google Analytics, Mixpanel, etc.
    console.log('Event:', eventName, eventData);
}

// Add tracking to CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('button_click', {
                button_text: buttonText,
                location: this.closest('section')?.className || 'unknown'
            });
        });
    });
});

// ==============================================
// ERROR HANDLING
// ==============================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    // In production, send errors to logging service
});

// ==============================================
// ACCESSIBILITY ENHANCEMENTS
// ==============================================

// Add keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    // Escape key closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const modal = document.querySelector('.modal.active');
            if (modal) {
                modal.classList.remove('active');
            }
        }
    });
    
    // Focus management for file upload
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.setAttribute('tabindex', '0');
    uploadArea.setAttribute('role', 'button');
    uploadArea.setAttribute('aria-label', 'Upload resume file');
    
    uploadArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });
});

// ==============================================
// LOADING STATE
// ==============================================

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('🎉 Vizzy loaded successfully!');
});
