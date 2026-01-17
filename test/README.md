# Game Tests

Comprehensive test suite for Philly Fingered game logic.

## Running Tests

### Option 1: Browser (Recommended)

1. Open `test/run-tests.html` in your browser
2. Tests will run automatically
3. Click "Run Tests" to re-run

### Option 2: Browser Console

1. Open `index.html` in browser
2. Open browser console (F12)
3. Copy and paste the contents of `game-tests.js`
4. Tests will run automatically

### Option 3: Node.js (if compatible)

```bash
node test/game-tests.js
```

## Test Coverage

### Distance Calculations
- ✅ Same point should be 0
- ✅ Known distances verified
- ✅ Nearby points calculated correctly

### Score Calculations
- ✅ Perfect guess (0m) = 100 points
- ✅ Max distance (5000m) = 0 points
- ✅ Exponential decay curve verified
- ✅ Edge cases (negative, very large distances)

### Location Progression
- ✅ Sequential progression (0→1→2→3→4)
- ✅ No skipping of locations
- ✅ Proper handling of already-guessed locations
- ✅ Completion detection
- ✅ Edge cases (single location, all guessed, etc.)

### Game State
- ✅ Correct structure
- ✅ Guess storage format
- ✅ Total score calculation

### Integration Tests
- ✅ Complete game flow from start to finish

## Adding New Tests

Add new test cases in `game-tests.js`:

```javascript
suite.test('Test name', () => {
    // Test code here
    suite.assertEquals(actual, expected);
});
```

## Test Results

- ✅ Green: Test passed
- ❌ Red: Test failed (with error message)

All tests should pass before deploying changes!
