/**
 * Game Logic Tests for Philly Fingered
 * 
 * Run in browser console or use: node test/run-tests.js
 */

// Simple test framework
class TestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('🧪 Running game tests...\n');
        
        for (const { name, fn } of this.tests) {
            try {
                await fn();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ ${name}`);
                console.error(`   Error: ${error.message}`);
                if (error.stack) {
                    console.error(`   ${error.stack.split('\n')[1]}`);
                }
                this.failed++;
            }
        }

        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEquals(actual, expected, message) {
        const msg = message || `Expected ${expected}, got ${actual}`;
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(msg);
        }
    }

    assertApprox(actual, expected, tolerance = 0.01, message) {
        const diff = Math.abs(actual - expected);
        const msg = message || `Expected ${expected} ± ${tolerance}, got ${actual}`;
        if (diff > tolerance) {
            throw new Error(msg);
        }
    }
}

// Mock game state for testing
const mockLocations = [
    { id: 0, name: 'Location 0', coordinates: [39.9496, -75.1503], icon: '🔔' },
    { id: 1, name: 'Location 1', coordinates: [39.9489, -75.1500], icon: '🏛️' },
    { id: 2, name: 'Location 2', coordinates: [39.9656, -75.1809], icon: '🎨' },
    { id: 3, name: 'Location 3', coordinates: [39.9531, -75.1584], icon: '🍕' },
    { id: 4, name: 'Location 4', coordinates: [39.9523, -75.1636], icon: '🏢' }
];

// Calculate distance between two lat/lng points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}

// Calculate score based on distance (0-100)
function calculateScore(distance, maxDistance = 5000) {
    if (distance >= maxDistance) {
        return 0;
    }
    const score = 100 * Math.pow(1 - (distance / maxDistance), 1.5);
    return Math.round(Math.max(0, Math.min(100, score)));
}

// Find next unguessed location index
function findNextUnguessedLocation(currentIndex, guesses, locations) {
    let nextIndex = currentIndex + 1;
    
    // Skip any already-guessed locations
    while (nextIndex < locations.length) {
        const testLocation = locations[nextIndex];
        if (!guesses[testLocation.id]) {
            // Found next unguessed location
            break;
        }
        // This location is already guessed, move to next
        nextIndex++;
    }
    
    return nextIndex < locations.length ? nextIndex : locations.length;
}

// Run tests
const suite = new TestSuite();

// Distance calculation tests
suite.test('Distance calculation: same point should be 0', () => {
    const dist = calculateDistance(39.9496, -75.1503, 39.9496, -75.1503);
    suite.assertApprox(dist, 0, 1); // Within 1 meter
});

suite.test('Distance calculation: Philadelphia to nearby point', () => {
    const dist = calculateDistance(39.9496, -75.1503, 39.9489, -75.1500);
    suite.assert(dist > 0 && dist < 1000, 'Should be less than 1km');
});

suite.test('Distance calculation: known distance verification', () => {
    // Distance between Liberty Bell and Independence Hall (very close)
    const dist = calculateDistance(39.9496, -75.1503, 39.9489, -75.1500);
    suite.assertApprox(dist, 86, 20); // Approximately 86 meters
});

// Score calculation tests
suite.test('Score calculation: perfect guess (0m) should be 100', () => {
    const score = calculateScore(0);
    suite.assertEquals(score, 100);
});

suite.test('Score calculation: max distance (5000m) should be 0', () => {
    const score = calculateScore(5000);
    suite.assertEquals(score, 0);
});

suite.test('Score calculation: beyond max distance should be 0', () => {
    const score = calculateScore(6000);
    suite.assertEquals(score, 0);
});

suite.test('Score calculation: halfway (2500m) should be positive', () => {
    const score = calculateScore(2500);
    suite.assert(score > 0 && score < 100, `Score should be between 0-100, got ${score}`);
});

suite.test('Score calculation: close guess should have high score', () => {
    const score = calculateScore(100);
    suite.assert(score > 80, `Close guess should score > 80, got ${score}`);
});

suite.test('Score calculation: far guess should have low score', () => {
    const score = calculateScore(4000);
    suite.assert(score < 30, `Far guess should score < 30, got ${score}`);
});

suite.test('Score calculation: exponential decay curve', () => {
    const close = calculateScore(500);
    const medium = calculateScore(2500);
    const far = calculateScore(4000);
    
    // Score should decrease non-linearly
    suite.assert(close > medium, 'Close should score higher than medium');
    suite.assert(medium > far, 'Medium should score higher than far');
    
    // The difference between close and medium should be larger than medium and far
    // (due to exponential decay)
    const diff1 = close - medium;
    const diff2 = medium - far;
    suite.assert(diff1 > diff2 * 0.5, 'Score decay should be exponential');
});

// Location progression tests
suite.test('Location progression: should go 0->1->2->3->4', () => {
    const guesses = {};
    
    // Start at location 0
    let currentIndex = 0;
    
    for (let expectedIndex = 0; expectedIndex < mockLocations.length; expectedIndex++) {
        suite.assertEquals(currentIndex, expectedIndex, 
            `At step ${expectedIndex}, currentIndex should be ${expectedIndex}, got ${currentIndex}`);
        
        // Simulate guessing this location
        guesses[mockLocations[currentIndex].id] = { score: 100, distance: 0 };
        
        // Move to next location
        currentIndex = findNextUnguessedLocation(currentIndex, guesses, mockLocations);
    }
    
    // After all locations guessed, should be at length (5)
    suite.assertEquals(currentIndex, mockLocations.length);
});

suite.test('Location progression: should not skip locations', () => {
    const guesses = {};
    const visitedIndices = [];
    let currentIndex = 0;
    
    for (let i = 0; i < mockLocations.length; i++) {
        visitedIndices.push(currentIndex);
        
        // Simulate guessing
        guesses[mockLocations[currentIndex].id] = { score: 100, distance: 0 };
        
        // Move to next
        currentIndex = findNextUnguessedLocation(currentIndex, guesses, mockLocations);
    }
    
    // Should have visited all indices 0, 1, 2, 3, 4
    const expected = [0, 1, 2, 3, 4];
    suite.assertEquals(visitedIndices.sort((a, b) => a - b), expected, 
        'Should visit all locations in order');
});

suite.test('Location progression: should skip already-guessed locations', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        2: { score: 100, distance: 0 }
    };
    let currentIndex = 0;
    
    // After guessing 0, next should be 1 (not 2, which is already guessed)
    currentIndex = findNextUnguessedLocation(currentIndex, guesses, mockLocations);
    suite.assertEquals(currentIndex, 1, 'Should skip to 1 after 0');
    
    // Guess 1, next should be 3 (skipping 2 which is already guessed)
    guesses[1] = { score: 100, distance: 0 };
    currentIndex = findNextUnguessedLocation(currentIndex, guesses, mockLocations);
    suite.assertEquals(currentIndex, 3, 'Should skip 2 and go to 3');
});

suite.test('Location progression: should handle completion correctly', () => {
    const guesses = {};
    let currentIndex = 0;
    
    // Guess all locations
    for (let i = 0; i < mockLocations.length; i++) {
        guesses[mockLocations[i].id] = { score: 100, distance: 0 };
    }
    
    // Try to find next - should return locations.length
    currentIndex = findNextUnguessedLocation(0, guesses, mockLocations);
    suite.assertEquals(currentIndex, mockLocations.length, 
        'Should return locations.length when all guessed');
});

suite.test('Location progression: should handle edge case at end', () => {
    const guesses = {};
    
    // Guess first 4 locations
    for (let i = 0; i < 4; i++) {
        guesses[mockLocations[i].id] = { score: 100, distance: 0 };
    }
    
    // Starting at index 3, next should be 4
    let currentIndex = findNextUnguessedLocation(3, guesses, mockLocations);
    suite.assertEquals(currentIndex, 4, 'Should go to last location (4)');
    
    // Guess location 4
    guesses[4] = { score: 100, distance: 0 };
    
    // Starting at index 4, should return locations.length
    currentIndex = findNextUnguessedLocation(4, guesses, mockLocations);
    suite.assertEquals(currentIndex, mockLocations.length, 
        'Should return locations.length when starting from last index');
});

// Total score calculation tests
suite.test('Total score: should sum all individual scores', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        1: { score: 80, distance: 100 },
        2: { score: 60, distance: 500 },
        3: { score: 40, distance: 1000 },
        4: { score: 20, distance: 2000 }
    };
    
    const totalScore = Object.values(guesses).reduce((sum, g) => sum + g.score, 0);
    suite.assertEquals(totalScore, 300);
});

suite.test('Total score: should handle empty guesses', () => {
    const guesses = {};
    const totalScore = Object.values(guesses).reduce((sum, g) => sum + g.score, 0);
    suite.assertEquals(totalScore, 0);
});

// Game state structure tests
suite.test('Game state: should have correct structure', () => {
    const gameState = {
        currentLocationIndex: 0,
        guesses: {},
        totalScore: 0
    };
    
    suite.assert('currentLocationIndex' in gameState, 'Should have currentLocationIndex');
    suite.assert('guesses' in gameState, 'Should have guesses');
    suite.assert('totalScore' in gameState, 'Should have totalScore');
    suite.assert(typeof gameState.currentLocationIndex === 'number', 
        'currentLocationIndex should be number');
    suite.assert(typeof gameState.guesses === 'object', 'guesses should be object');
    suite.assert(typeof gameState.totalScore === 'number', 'totalScore should be number');
});

suite.test('Guesses structure: should store location.id as key', () => {
    const guesses = {
        0: { latlng: { lat: 39.9496, lng: -75.1503 }, distance: 100, score: 90 },
        1: { latlng: { lat: 39.9489, lng: -75.1500 }, distance: 50, score: 95 }
    };
    
    suite.assert('0' in guesses || 0 in guesses, 'Should have key 0');
    suite.assert('1' in guesses || 1 in guesses, 'Should have key 1');
    suite.assert(typeof guesses[0].distance === 'number', 'Distance should be number');
    suite.assert(typeof guesses[0].score === 'number', 'Score should be number');
});

// Location ID consistency tests
suite.test('Location IDs: should match array indices', () => {
    mockLocations.forEach((location, index) => {
        suite.assertEquals(location.id, index, 
            `Location at index ${index} should have id ${index}, got ${location.id}`);
    });
});

suite.test('Location IDs: should be sequential', () => {
    const ids = mockLocations.map(loc => loc.id);
    const expected = [0, 1, 2, 3, 4];
    suite.assertEquals(ids, expected, 'Location IDs should be 0, 1, 2, 3, 4');
});

// Edge case tests
suite.test('Edge case: single location', () => {
    const singleLocation = [{ id: 0, name: 'Single', coordinates: [39.9496, -75.1503], icon: '🔔' }];
    const guesses = {};
    
    let currentIndex = 0;
    currentIndex = findNextUnguessedLocation(currentIndex, guesses, singleLocation);
    suite.assertEquals(currentIndex, 1, 'Single location: next should be 1 (length)');
});

suite.test('Edge case: all locations already guessed at start', () => {
    const guesses = {};
    mockLocations.forEach(loc => {
        guesses[loc.id] = { score: 100, distance: 0 };
    });
    
    const nextIndex = findNextUnguessedLocation(0, guesses, mockLocations);
    suite.assertEquals(nextIndex, mockLocations.length, 
        'All guessed: should return locations.length');
});

suite.test('Edge case: very large distance should score 0', () => {
    const score = calculateScore(100000); // 100km
    suite.assertEquals(score, 0);
});

suite.test('Edge case: negative distance should not crash', () => {
    // Should handle gracefully or clamp to 0
    const score = calculateScore(-100);
    suite.assert(score >= 0 && score <= 100, `Score should be 0-100, got ${score}`);
});

// Integration test: full game flow
suite.test('Integration: complete game flow', () => {
    const gameState = {
        currentLocationIndex: 0,
        guesses: {},
        totalScore: 0
    };
    
    // Simulate guessing all 5 locations
    for (let i = 0; i < mockLocations.length; i++) {
        // Verify we're at the right location
        suite.assertEquals(gameState.currentLocationIndex, i, 
            `Should be at location ${i} on iteration ${i}`);
        
        const location = mockLocations[gameState.currentLocationIndex];
        
        // Simulate a guess (100m away)
        const distance = 100;
        const score = calculateScore(distance);
        
        // Store guess
        gameState.guesses[location.id] = {
            latlng: { lat: location.coordinates[0] + 0.001, lng: location.coordinates[1] + 0.001 },
            distance: distance,
            score: score
        };
        
        // Update total score
        gameState.totalScore = Object.values(gameState.guesses).reduce((sum, g) => sum + g.score, 0);
        
        // Advance to next location
        if (i < mockLocations.length - 1) {
            gameState.currentLocationIndex = findNextUnguessedLocation(
                gameState.currentLocationIndex, 
                gameState.guesses, 
                mockLocations
            );
        }
    }
    
    // Verify final state
    suite.assertEquals(Object.keys(gameState.guesses).length, mockLocations.length, 
        'Should have guesses for all locations');
    suite.assert(gameState.totalScore > 0, 'Total score should be positive');
    suite.assert(gameState.totalScore <= 500, 'Total score should be <= 500');
});

// Run all tests
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = suite;
} else {
    // Browser - run immediately
    suite.run().then(success => {
        if (success) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log('\n⚠️  Some tests failed. Please review the errors above.');
        }
    });
}
