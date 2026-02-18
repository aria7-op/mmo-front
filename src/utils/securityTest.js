/**
 * Security Testing Utilities
 * Test functions to verify XSS protection and input sanitization
 */

import { sanitizeInput, sanitizeTextInput, sanitizeTextarea, sanitizeEmail } from './inputSanitizer';

/**
 * Test XSS attack vectors
 * @returns {object} - Test results
 */
export const testXSSProtection = () => {
    const testCases = [
        {
            name: 'Basic Script Tag',
            input: '<script>alert("XSS")</script>',
            expected: ''
        },
        {
            name: 'Script with Attributes',
            input: '<script src="evil.js"></script>',
            expected: ''
        },
        {
            name: 'Event Handler',
            input: '<img onclick="alert(\'XSS\')" src="x">',
            expected: ''
        },
        {
            name: 'JavaScript Protocol',
            input: 'javascript:alert("XSS")',
            expected: ''
        },
        {
            name: 'HTML Injection',
            input: '<div style="color:red">Malicious</div>',
            expected: ''
        },
        {
            name: 'IFrame Injection',
            input: '<iframe src="evil.com"></iframe>',
            expected: ''
        },
        {
            name: 'CSS Expression',
            input: 'style="expression(alert(\'XSS\'))"',
            expected: ''
        },
        {
            name: 'Data URI',
            input: 'data:text/html,<script>alert("XSS")</script>',
            expected: ''
        },
        {
            name: 'HTML Comment with Script',
            input: '<!-- <script>alert("XSS")</script> -->',
            expected: ''
        },
        {
            name: 'Encoded Script',
            input: '&lt;script&gt;alert("XSS")&lt;/script&gt;',
            expected: 'alert("XSS")'
        }
    ];

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    testCases.forEach(testCase => {
        const sanitized = sanitizeInput(testCase.input);
        const passed = sanitized === testCase.expected;
        
        results.tests.push({
            name: testCase.name,
            input: testCase.input,
            expected: testCase.expected,
            actual: sanitized,
            passed
        });

        if (passed) {
            results.passed++;
        } else {
            results.failed++;
        }
    });

    return results;
};

/**
 * Test email sanitization
 * @returns {object} - Test results
 */
export const testEmailSanitization = () => {
    const testCases = [
        {
            name: 'Valid Email',
            input: 'test@example.com',
            expected: 'test@example.com'
        },
        {
            name: 'Email with Script',
            input: '<script>alert("XSS")</script>test@example.com',
            expected: 'test@example.com'
        },
        {
            name: 'Invalid Email',
            input: 'not-an-email',
            expected: ''
        },
        {
            name: 'Email with HTML',
            input: 'test<span>@example.com',
            expected: ''
        }
    ];

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    testCases.forEach(testCase => {
        const sanitized = sanitizeEmail(testCase.input);
        const passed = sanitized === testCase.expected;
        
        results.tests.push({
            name: testCase.name,
            input: testCase.input,
            expected: testCase.expected,
            actual: sanitized,
            passed
        });

        if (passed) {
            results.passed++;
        } else {
            results.failed++;
        }
    });

    return results;
};

/**
 * Test textarea sanitization
 * @returns {object} - Test results
 */
export const testTextareaSanitization = () => {
    const testCases = [
        {
            name: 'Safe Text',
            input: 'This is safe text',
            expected: 'This is safe text'
        },
        {
            name: 'Text with Script',
            input: 'Safe text <script>alert("XSS")</script>',
            expected: 'Safe text '
        },
        {
            name: 'Allowed HTML',
            input: '<p>Safe paragraph</p><strong>Bold text</strong>',
            expected: '<p>Safe paragraph</p><strong>Bold text</strong>'
        },
        {
            name: 'Dangerous HTML',
            input: '<p>Safe</p><script>alert("XSS")</script>',
            expected: '<p>Safe</p>'
        }
    ];

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    testCases.forEach(testCase => {
        const sanitized = sanitizeTextarea(testCase.input);
        const passed = sanitized === testCase.expected;
        
        results.tests.push({
            name: testCase.name,
            input: testCase.input,
            expected: testCase.expected,
            actual: sanitized,
            passed
        });

        if (passed) {
            results.passed++;
        } else {
            results.failed++;
        }
    });

    return results;
};

/**
 * Run all security tests
 * @returns {object} - Complete test results
 */
export const runSecurityTests = () => {
    const xssResults = testXSSProtection();
    const emailResults = testEmailSanitization();
    const textareaResults = testTextareaSanitization();

    const totalTests = xssResults.tests.length + emailResults.tests.length + textareaResults.tests.length;
    const totalPassed = xssResults.passed + emailResults.passed + textareaResults.passed;
    const totalFailed = xssResults.failed + emailResults.failed + textareaResults.failed;

    return {
        summary: {
            total: totalTests,
            passed: totalPassed,
            failed: totalFailed,
            passRate: Math.round((totalPassed / totalTests) * 100)
        },
        xssProtection: xssResults,
        emailSanitization: emailResults,
        textareaSanitization: textareaResults
    };
};

/**
 * Test form validation with malicious input
 * @param {Function} validateFunction - Form validation function to test
 * @returns {object} - Test results
 */
export const testFormValidation = (validateFunction) => {
    const maliciousInputs = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src=x onerror=alert("XSS")>',
        '<div onclick="alert(\'XSS\')">Click me</div>',
        '"><script>alert("XSS")</script>',
        '\x3Cscript\x3Ealert("XSS")\x3C/script\x3E'
    ];

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    maliciousInputs.forEach((input, index) => {
        try {
            const result = validateFunction(input);
            const isClean = !result.includes('<script') && 
                          !result.includes('javascript:') && 
                          !result.includes('onerror') &&
                          !result.includes('onclick');
            
            const passed = isClean;
            
            results.tests.push({
                name: `Malicious Input ${index + 1}`,
                input: input,
                result: result,
                passed
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        } catch (error) {
            results.tests.push({
                name: `Malicious Input ${index + 1}`,
                input: input,
                error: error.message,
                passed: false
            });
            results.failed++;
        }
    });

    return results;
};

export default {
    testXSSProtection,
    testEmailSanitization,
    testTextareaSanitization,
    runSecurityTests,
    testFormValidation
};
