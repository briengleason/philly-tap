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
        getElementById: () => null, // Map container won't exist in headless
        createElement: () => ({ style: {} }),
        head: { appendChild: () => {} }
    };
    global.L = undefined; // Leaflet not available in Node
    global.navigator = {
        clipboard: undefined,
        share: undefined
    };
    // Mock fetch for Node.js (if not available)
    if (typeof global.fetch === 'undefined') {
        global.fetch = async () => ({
            text: async () => '',
            ok: true
        });
    }
    // Mock jsyaml
    global.jsyaml = {
        load: () => ({}),
        JSON_SCHEMA: {}
    };
}

// Load test suite
const fs = require('fs');
const path = require('path');
const testFile = fs.readFileSync(path.join(__dirname, 'game-tests.js'), 'utf8');

// Execute test file to define suite
eval(testFile);

// Override console.log to capture output but still show it
const originalLog = console.log;
const originalError = console.error;
let output = [];

console.log = function(...args) {
    const msg = args.join(' ');
    output.push(msg);
    originalLog.apply(console, args);
};

console.error = function(...args) {
    const msg = args.join(' ');
    output.push('ERROR: ' + msg);
    originalError.apply(console, args);
};

// Run tests
if (typeof suite !== 'undefined' && suite.tests.length > 0) {
    suite.run().then(success => {
        const passed = suite.passed;
        const failed = suite.failed;
        const total = passed + failed;
        
        console.log(`\n📊 Test Summary: ${passed}/${total} passed, ${failed} failed`);
        
        if (success) {
            originalLog('\n✅ All tests passed!');
            process.exit(0);
        } else {
            originalError('\n❌ Some tests failed. Commit blocked.');
            process.exit(1);
        }
    }).catch(err => {
        originalError('Test runner error:', err);
        process.exit(1);
    });
} else {
    originalError('Test suite not found');
    process.exit(1);
}
