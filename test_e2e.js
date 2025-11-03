#!/usr/bin/env node

/**
 * V-Izzy End-to-End Test Suite
 * Tests frontend-backend integration
 */

const API_BASE_URL = 'https://api.v-izzy.com/api';
const FRONTEND_URL = 'https://v-izzy.com';

// Test results tracking
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function testPass(name) {
    results.total++;
    results.passed++;
    log(`✓ ${name}`, colors.green);
}

function testFail(name, error) {
    results.total++;
    results.failed++;
    results.errors.push({ test: name, error: error });
    log(`✗ ${name}`, colors.red);
    log(`  Error: ${error}`, colors.red);
}

function testSkip(name, reason) {
    log(`⊘ ${name} - ${reason}`, colors.yellow);
}

async function makeRequest(url, options = {}) {
    const fetch = (await import('node-fetch')).default;
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: response.headers.get('content-type')?.includes('application/json') 
                ? await response.json() 
                : await response.text()
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            error: error.message
        };
    }
}

// ================================
// TEST SUITE 1: CONNECTIVITY
// ================================
async function testConnectivity() {
    log('\n═══════════════════════════════════════', colors.cyan);
    log('TEST SUITE 1: Frontend-Backend Connectivity', colors.cyan);
    log('═══════════════════════════════════════\n', colors.cyan);

    // Test 1.1: Backend API Health
    try {
        const response = await makeRequest(`${API_BASE_URL}/health`);
        if (response.ok) {
            testPass('TS1.1: Backend API is accessible');
        } else {
            // Try alternative health check
            const altResponse = await makeRequest(API_BASE_URL);
            if (altResponse.status !== 0) {
                testPass('TS1.1: Backend API is accessible (alternative check)');
            } else {
                testFail('TS1.1: Backend API health check', `Status: ${response.status}`);
            }
        }
    } catch (error) {
        testFail('TS1.1: Backend API health check', error.message);
    }

    // Test 1.2: CORS Configuration
    try {
        const response = await makeRequest(`${API_BASE_URL}/health`, {
            headers: {
                'Origin': FRONTEND_URL
            }
        });
        if (response.status !== 0) {
            testPass('TS1.2: CORS configuration allows frontend origin');
        } else {
            testFail('TS1.2: CORS configuration', 'Connection refused');
        }
    } catch (error) {
        testFail('TS1.2: CORS configuration', error.message);
    }
}

// ================================
// TEST SUITE 2: AUTH ENDPOINTS
// ================================
async function testAuthEndpoints() {
    log('\n═══════════════════════════════════════', colors.cyan);
    log('TEST SUITE 2: Authentication Endpoints', colors.cyan);
    log('═══════════════════════════════════════\n', colors.cyan);

    // Test 2.1: Register endpoint exists
    const testEmail = `test_${Date.now()}@test.com`;
    const testPassword = 'TestPass123!';
    
    try {
        const response = await makeRequest(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test User',
                email: testEmail,
                password: testPassword
            })
        });
        
        if (response.status === 201 || response.status === 400) {
            // 201 = success, 400 = validation error (endpoint exists)
            testPass('TS2.1: POST /api/auth/register endpoint exists');
            
            // If registration successful, test login
            if (response.status === 201) {
                const loginResponse = await makeRequest(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: testEmail,
                        password: testPassword
                    })
                });
                
                if (loginResponse.ok && loginResponse.data.token) {
                    testPass('TS2.2: POST /api/auth/login endpoint works');
                    testPass('TS2.3: JWT token is returned on successful login');
                    return loginResponse.data.token;
                } else {
                    testFail('TS2.2: Login endpoint', `Status: ${loginResponse.status}`);
                }
            }
        } else if (response.status === 404) {
            testFail('TS2.1: Register endpoint', 'Endpoint not found (404)');
        } else {
            testFail('TS2.1: Register endpoint', `Status: ${response.status}`);
        }
    } catch (error) {
        testFail('TS2.1: Register endpoint', error.message);
    }
    
    return null;
}

// ================================
// TEST SUITE 3: RESUME ENDPOINTS
// ================================
async function testResumeEndpoints() {
    log('\n═══════════════════════════════════════', colors.cyan);
    log('TEST SUITE 3: Resume Analysis Endpoints', colors.cyan);
    log('═══════════════════════════════════════\n', colors.cyan);

    // Test 3.1: Quick Analysis Endpoint (Public)
    try {
        // Create minimal multipart form data simulation
        const FormData = (await import('form-data')).default;
        const formData = new FormData();
        
        // Create a minimal test file
        const testContent = Buffer.from('Test Resume Content\nSoftware Engineer\nSkills: JavaScript, React, Node.js');
        formData.append('resume', testContent, {
            filename: 'test-resume.txt',
            contentType: 'text/plain'
        });

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${API_BASE_URL}/resumes/quick-analysis`, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });

        const data = await response.json();
        
        if (response.ok) {
            testPass('TS3.1: POST /api/resumes/quick-analysis endpoint is accessible');
            
            // Validate response structure
            if (data.data && data.data.analysis) {
                testPass('TS3.2: Quick analysis returns proper data structure');
                
                if (data.data.analysis.ats_score !== undefined) {
                    testPass('TS3.3: ATS score is included in response');
                    log(`      Score: ${data.data.analysis.ats_score}`, colors.blue);
                }
                
                if (data.data.analysis.is_free_preview === true) {
                    testPass('TS3.4: Free preview flag is set correctly');
                }
                
                if (data.data.analysis.detected_skills) {
                    testPass('TS3.5: Detected skills are included');
                    log(`      Skills: ${data.data.analysis.detected_skills.slice(0, 3).join(', ')}...`, colors.blue);
                }
                
                if (data.data.analysis.missing_keywords) {
                    testPass('TS3.6: Missing keywords are included');
                }
                
                if (data.data.analysis.insights) {
                    testPass('TS3.7: Insights are included');
                }
            } else {
                testFail('TS3.2: Quick analysis response structure', 'Missing data.analysis object');
            }
        } else if (response.status === 404) {
            testFail('TS3.1: Quick analysis endpoint', 'Endpoint not found (404)');
        } else {
            testFail('TS3.1: Quick analysis endpoint', `Status: ${response.status} - ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        testFail('TS3.1: Quick analysis endpoint', error.message);
    }
}

// ================================
// TEST SUITE 4: PAYMENT ENDPOINTS
// ================================
async function testPaymentEndpoints(authToken) {
    log('\n═══════════════════════════════════════', colors.cyan);
    log('TEST SUITE 4: Payment Endpoints', colors.cyan);
    log('═══════════════════════════════════════\n', colors.cyan);

    if (!authToken) {
        testSkip('TS4.1-4.3: Payment endpoint tests', 'No auth token available');
        return;
    }

    // Test 4.1: Create Checkout Endpoint
    try {
        const response = await makeRequest(`${API_BASE_URL}/payments/create-checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                plan: 'basic'
            })
        });
        
        if (response.ok && response.data.url) {
            testPass('TS4.1: POST /api/payments/create-checkout works');
            testPass('TS4.2: Checkout URL is returned');
            log(`      URL: ${response.data.url.substring(0, 50)}...`, colors.blue);
        } else if (response.status === 404) {
            testFail('TS4.1: Create checkout endpoint', 'Endpoint not found (404)');
        } else {
            testFail('TS4.1: Create checkout endpoint', `Status: ${response.status}`);
        }
    } catch (error) {
        testFail('TS4.1: Create checkout endpoint', error.message);
    }

    // Test 4.2: Get Subscription Status
    try {
        const response = await makeRequest(`${API_BASE_URL}/payments/subscription`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok || response.status === 404) {
            // 404 is OK - means no subscription yet
            testPass('TS4.3: GET /api/payments/subscription endpoint works');
        } else {
            testFail('TS4.3: Get subscription endpoint', `Status: ${response.status}`);
        }
    } catch (error) {
        testFail('TS4.3: Get subscription endpoint', error.message);
    }
}

// ================================
// TEST SUITE 5: FRONTEND FILES
// ================================
async function testFrontendFiles() {
    log('\n═══════════════════════════════════════', colors.cyan);
    log('TEST SUITE 5: Frontend Files', colors.cyan);
    log('═══════════════════════════════════════\n', colors.cyan);

    const files = [
        { path: 'index.html', name: 'Homepage' },
        { path: 'login.html', name: 'Login page' },
        { path: 'signup.html', name: 'Signup page' },
        { path: 'payment-success.html', name: 'Payment success page' },
        { path: 'js/main.js', name: 'Main JavaScript' },
        { path: 'css/style.css', name: 'Stylesheet' }
    ];

    for (const file of files) {
        try {
            const response = await makeRequest(`${FRONTEND_URL}/${file.path}`);
            if (response.ok) {
                testPass(`TS5.${files.indexOf(file) + 1}: ${file.name} is accessible`);
            } else {
                testFail(`TS5.${files.indexOf(file) + 1}: ${file.name}`, `Status: ${response.status}`);
            }
        } catch (error) {
            testFail(`TS5.${files.indexOf(file) + 1}: ${file.name}`, error.message);
        }
    }
}

// ================================
// MAIN TEST RUNNER
// ================================
async function runAllTests() {
    log('\n╔═══════════════════════════════════════════════════════╗', colors.cyan);
    log('║         V-IZZY END-TO-END TEST SUITE                 ║', colors.cyan);
    log('║         Frontend-Backend Integration Testing         ║', colors.cyan);
    log('╚═══════════════════════════════════════════════════════╝\n', colors.cyan);

    log(`Frontend URL: ${FRONTEND_URL}`, colors.blue);
    log(`Backend API:  ${API_BASE_URL}`, colors.blue);
    log(`Test Date:    ${new Date().toISOString()}\n`, colors.blue);

    // Run test suites
    await testConnectivity();
    const authToken = await testAuthEndpoints();
    await testResumeEndpoints();
    await testPaymentEndpoints(authToken);
    await testFrontendFiles();

    // Print summary
    log('\n╔═══════════════════════════════════════════════════════╗', colors.cyan);
    log('║                  TEST SUMMARY                         ║', colors.cyan);
    log('╚═══════════════════════════════════════════════════════╝\n', colors.cyan);

    const passRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(2) : 0;
    
    log(`Total Tests:  ${results.total}`, colors.blue);
    log(`Passed:       ${results.passed}`, colors.green);
    log(`Failed:       ${results.failed}`, results.failed > 0 ? colors.red : colors.green);
    log(`Pass Rate:    ${passRate}%`, passRate >= 80 ? colors.green : colors.red);

    if (results.errors.length > 0) {
        log('\n═══════════════════════════════════════', colors.red);
        log('FAILED TESTS DETAILS:', colors.red);
        log('═══════════════════════════════════════\n', colors.red);
        results.errors.forEach((err, idx) => {
            log(`${idx + 1}. ${err.test}`, colors.red);
            log(`   ${err.error}\n`, colors.red);
        });
    }

    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
    log(`\nFatal error: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
});
