/**
 * Synchronous test runner that can be used in pre-commit hooks
 * Loads test file and runs tests, exits with error code if tests fail
 */

// Mock DOM for tests that don't require actual DOM
if (typeof window === 'undefined') {
    global.window = {
        map: undefined,
        getComputedStyle: () => ({
            display: 'block',
            visibility: 'visible',
            opacity: '1',
            width: '100%',
            height: '100vh',
            position: 'fixed',
            zIndex: '1'
        })
    };
    global.document = {
        getElementById: () => null,
        querySelector: () => null,
        createElement: () => ({ style: {} }),
        head: { appendChild: () => {} }
    };
    global.L = undefined;
    global.navigator = {
        clipboard: undefined,
        share: undefined
    };
}

// Load and run tests
const fs = require('fs');
const path = require('path');

// Read the test file
const testFile = fs.readFileSync(path.join(__dirname, 'game-tests.js'), 'utf8');

// Function to run the tests
function runTests() {
    let suite;
    
    // Execute test file in a controlled scope
    const testCode = `
    (function() {
        ${testFile}
        return suite;
    })()
    `;
    
    try {
        suite = eval(testCode);
    } catch(e) {
        console.error('Error loading tests:', e.message);
        process.exit(1);
    }
    
    if (!suite || !suite.tests || suite.tests.length === 0) {
        console.error('Test suite not found or has no tests');
        process.exit(1);
    }
    
    // Run the tests
    suite.run().then(success => {
        const passed = suite.passed;
        const failed = suite.failed;
        const total = passed + failed;
        
        console.log(`\n📊 Test Summary: ${passed}/${total} passed, ${failed} failed`);
        
        if (success) {
            console.log('\n✅ All tests passed!');
            process.exit(0);
        } else {
            console.log('\n❌ Some tests failed. Commit blocked.');
            process.exit(1);
        }
    }).catch(err => {
        console.error('Test runner error:', err);
        process.exit(1);
    });
}

// Run the tests
runTests();
