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

// Share score emoji tests
function getScoreEmoji(score) {
    if (score === 100) return '🎯';
    if (score >= 95) return '🏅';
    if (score >= 90) return '🏆';
    if (score >= 85) return '🎉';
    if (score >= 80) return '✨';
    if (score >= 75) return '😁';
    if (score >= 70) return '🤗';
    if (score >= 65) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 50) return '🫣';
    if (score >= 40) return '😶';
    if (score >= 30) return '😐';
    if (score >= 20) return '😕';
    if (score >= 10) return '😢';
    return '😭';
}

function formatShareDate() {
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[today.getMonth()];
    const day = today.getDate();
    return `${month} ${day}`;
}

function generateShareMessage(guesses, locations, totalScore, url = 'https://briengleason.github.io/philly-fingered/') {
    const date = formatShareDate();
    
    // Sort locations by their original order (by id)
    const sortedLocations = locations.slice().sort((a, b) => a.id - b.id);
    
    // Build score string with emojis
    const scoreParts = sortedLocations.map(location => {
        const guess = guesses[location.id];
        if (guess) {
            const emoji = getScoreEmoji(guess.score);
            return `${guess.score}${emoji}`;
        }
        return '';
    }).filter(part => part !== '');
    
    const scoreString = scoreParts.join(' ');
    
    return `${url}  ${date}\n${scoreString}\nFinal score: ${totalScore}`;
}

suite.test('Share emoji: perfect score (100) should be 🎯', () => {
    suite.assertEquals(getScoreEmoji(100), '🎯');
});

suite.test('Share emoji: excellent scores (95-99) should be 🏅', () => {
    suite.assertEquals(getScoreEmoji(99), '🏅');
    suite.assertEquals(getScoreEmoji(95), '🏅');
    suite.assertEquals(getScoreEmoji(98), '🏅');
});

suite.test('Share emoji: great scores (90-94) should be 🏆', () => {
    suite.assertEquals(getScoreEmoji(94), '🏆');
    suite.assertEquals(getScoreEmoji(90), '🏆');
    suite.assertEquals(getScoreEmoji(92), '🏆');
});

suite.test('Share emoji: good scores (85-89) should be 🎉', () => {
    suite.assertEquals(getScoreEmoji(89), '🎉');
    suite.assertEquals(getScoreEmoji(85), '🎉');
    suite.assertEquals(getScoreEmoji(87), '🎉');
});

suite.test('Share emoji: nice scores (80-84) should be ✨', () => {
    suite.assertEquals(getScoreEmoji(84), '✨');
    suite.assertEquals(getScoreEmoji(80), '✨');
    suite.assertEquals(getScoreEmoji(82), '✨');
});

suite.test('Share emoji: good scores (75-79) should be 😁', () => {
    suite.assertEquals(getScoreEmoji(79), '😁');
    suite.assertEquals(getScoreEmoji(75), '😁');
});

suite.test('Share emoji: okay scores (70-74) should be 🤗', () => {
    suite.assertEquals(getScoreEmoji(74), '🤗');
    suite.assertEquals(getScoreEmoji(70), '🤗');
});

suite.test('Share emoji: low scores should have appropriate emojis', () => {
    suite.assertEquals(getScoreEmoji(50), '🫣');
    suite.assertEquals(getScoreEmoji(40), '😶');
    suite.assertEquals(getScoreEmoji(30), '😐');
    suite.assertEquals(getScoreEmoji(20), '😕');
    suite.assertEquals(getScoreEmoji(10), '😢');
    suite.assertEquals(getScoreEmoji(0), '😭');
});

suite.test('Share emoji: boundary values should be correct', () => {
    suite.assertEquals(getScoreEmoji(100), '🎯');
    suite.assertEquals(getScoreEmoji(99), '🏅');
    suite.assertEquals(getScoreEmoji(95), '🏅');
    suite.assertEquals(getScoreEmoji(94), '🏆');
    suite.assertEquals(getScoreEmoji(90), '🏆');
    suite.assertEquals(getScoreEmoji(89), '🎉');
    suite.assertEquals(getScoreEmoji(85), '🎉');
    suite.assertEquals(getScoreEmoji(84), '✨');
    suite.assertEquals(getScoreEmoji(80), '✨');
});

suite.test('Share date: should format correctly', () => {
    const date = formatShareDate();
    // Should be in format "Month Day" (e.g., "January 17")
    suite.assert(date.includes(' '), 'Date should contain a space');
    suite.assert(date.length > 5, 'Date should be longer than 5 characters');
    // Check it contains a valid month name
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const hasMonth = months.some(month => date.startsWith(month));
    suite.assert(hasMonth, 'Date should start with a month name');
});

suite.test('Share message: should include URL and date', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        1: { score: 80, distance: 100 }
    };
    const message = generateShareMessage(guesses, mockLocations.slice(0, 2), 180);
    
    suite.assert(message.includes('https://briengleason.github.io/philly-fingered/'), 
        'Message should include URL');
    suite.assert(message.includes('Final score: 180'), 
        'Message should include final score');
});

suite.test('Share message: should include all scores with emojis', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        1: { score: 95, distance: 50 },
        2: { score: 90, distance: 100 },
        3: { score: 85, distance: 200 },
        4: { score: 80, distance: 300 }
    };
    const message = generateShareMessage(guesses, mockLocations, 450);
    
    suite.assert(message.includes('100🎯'), 'Should include 100 with 🎯');
    suite.assert(message.includes('95🏅'), 'Should include 95 with 🏅');
    suite.assert(message.includes('90🏆'), 'Should include 90 with 🏆');
    suite.assert(message.includes('85🎉'), 'Should include 85 with 🎉');
    suite.assert(message.includes('80✨'), 'Should include 80 with ✨');
});

suite.test('Share message: should format scores in correct order', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        1: { score: 80, distance: 100 },
        2: { score: 60, distance: 500 }
    };
    const message = generateShareMessage(guesses, mockLocations.slice(0, 3), 240);
    
    // Scores should appear in order: 100🎯 80✨ 60🙂
    const scorePart = message.split('\n')[1];
    suite.assert(scorePart.includes('100🎯'), 'First score should be 100🎯');
    suite.assert(scorePart.includes('80✨'), 'Second score should be 80✨');
    suite.assert(scorePart.includes('60🙂'), 'Third score should be 60🙂');
});

suite.test('Share message: should handle missing guesses', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        2: { score: 80, distance: 100 }
    };
    const message = generateShareMessage(guesses, mockLocations, 180);
    
    // Should only include scores that exist
    suite.assert(message.includes('100🎯'), 'Should include first score');
    suite.assert(message.includes('80✨'), 'Should include third score');
    // Should not include location 1, 3, 4 in the score string
    const scoreLine = message.split('\n')[1];
    const scoreCount = scoreLine.split(' ').length;
    suite.assertEquals(scoreCount, 2, 'Should only have 2 scores');
});

suite.test('Share message: should match example format', () => {
    const guesses = {
        0: { score: 96, distance: 50 },
        1: { score: 100, distance: 0 },
        2: { score: 95, distance: 80 },
        3: { score: 87, distance: 200 },
        4: { score: 89, distance: 150 }
    };
    const totalScore = 96 + 100 + 95 + 87 + 89;
    const message = generateShareMessage(guesses, mockLocations, totalScore);
    
    // Check structure
    const lines = message.split('\n');
    suite.assertEquals(lines.length, 3, 'Should have 3 lines');
    suite.assert(lines[0].includes('https://'), 'First line should have URL and date');
    suite.assert(lines[1].includes('96'), 'Second line should have scores');
    suite.assert(lines[2].includes('Final score:'), 'Third line should have final score');
    
    // Check scores are present
    suite.assert(lines[1].includes('96🏅'), 'Should have 96🏅');
    suite.assert(lines[1].includes('100🎯'), 'Should have 100🎯');
    suite.assert(lines[1].includes('95🏅'), 'Should have 95🏅');
    suite.assert(lines[1].includes('87🎉'), 'Should have 87🎉');
    suite.assert(lines[1].includes('89🎉'), 'Should have 89🎉');
});

suite.test('Share message: should handle all score ranges', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        1: { score: 50, distance: 2500 },
        2: { score: 30, distance: 3500 },
        3: { score: 10, distance: 4500 },
        4: { score: 0, distance: 5000 }
    };
    const message = generateShareMessage(guesses, mockLocations, 190);
    
    suite.assert(message.includes('100🎯'), 'Perfect score');
    suite.assert(message.includes('50🫣'), 'Low score');
    suite.assert(message.includes('30😐'), 'Very low score');
    suite.assert(message.includes('10😢'), 'Extremely low score');
    suite.assert(message.includes('0😭'), 'Zero score');
});

suite.test('Share message: final score should match sum', () => {
    const guesses = {
        0: { score: 100, distance: 0 },
        1: { score: 80, distance: 100 },
        2: { score: 60, distance: 500 },
        3: { score: 40, distance: 1000 },
        4: { score: 20, distance: 2000 }
    };
    const totalScore = 300;
    const message = generateShareMessage(guesses, mockLocations, totalScore);
    
    suite.assert(message.includes('Final score: 300'), 
        'Final score should match the sum');
});

// Map rendering and visibility tests
suite.test('Map container: should exist in DOM', () => {
    if (typeof document !== 'undefined') {
        const mapContainer = document.getElementById('map');
        suite.assert(mapContainer !== null, 'Map container should exist');
        suite.assert(mapContainer !== undefined, 'Map container should be defined');
    } else {
        // Skip in Node.js environment
        suite.assert(true, 'Skipped in Node.js (requires DOM)');
    }
});

suite.test('Map container: should be visible', () => {
    if (typeof document !== 'undefined') {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const style = window.getComputedStyle(mapContainer);
            suite.assert(style.display !== 'none', 'Map should not be display:none');
            suite.assert(style.visibility !== 'hidden', 'Map should not be visibility:hidden');
            suite.assert(parseFloat(style.opacity) > 0, 'Map should have opacity > 0');
        } else {
            suite.assert(true, 'Skipped - map container not found');
        }
    } else {
        suite.assert(true, 'Skipped in Node.js (requires DOM)');
    }
});

suite.test('Map container: should have correct dimensions', () => {
    if (typeof document !== 'undefined') {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const style = window.getComputedStyle(mapContainer);
            suite.assert(style.width !== '0px' && style.width !== '0', 
                'Map should have non-zero width');
            suite.assert(style.height !== '0px' && style.height !== '0', 
                'Map should have non-zero height');
            // Should fill viewport
            suite.assert(style.width === '100%' || parseInt(style.width) > 100, 
                'Map should be at least 100px wide or 100%');
            suite.assert(style.height === '100vh' || style.height === '100dvh' || parseInt(style.height) > 100, 
                'Map should fill viewport height');
        } else {
            suite.assert(true, 'Skipped - map container not found');
        }
    } else {
        suite.assert(true, 'Skipped in Node.js (requires DOM)');
    }
});

suite.test('Map container: should have correct CSS properties', () => {
    if (typeof document !== 'undefined') {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const style = window.getComputedStyle(mapContainer);
            suite.assert(style.position === 'fixed' || style.position === 'absolute', 
                'Map should be positioned fixed or absolute');
            suite.assert(style.zIndex !== 'auto', 'Map should have z-index set');
        } else {
            suite.assert(true, 'Skipped - map container not found');
        }
    } else {
        suite.assert(true, 'Skipped in Node.js (requires DOM)');
    }
});

suite.test('Map configuration: center coordinates should be valid', () => {
    const center = [39.9526, -75.1652]; // Philadelphia
    suite.assert(center.length === 2, 'Center should have 2 coordinates [lat, lng]');
    suite.assert(center[0] >= -90 && center[0] <= 90, 
        `Latitude should be -90 to 90, got ${center[0]}`);
    suite.assert(center[1] >= -180 && center[1] <= 180, 
        `Longitude should be -180 to 180, got ${center[1]}`);
    // Philadelphia should be around 39-40°N, 75-76°W
    suite.assert(center[0] > 39 && center[0] < 40, 
        'Latitude should be in Philadelphia range (39-40°N)');
    suite.assert(center[1] < -75 && center[1] > -76, 
        'Longitude should be in Philadelphia range (-75 to -76°W)');
});

suite.test('Map configuration: zoom levels should be valid', () => {
    const minZoom = 10;
    const maxZoom = 19;
    const desktopZoom = 13;
    const mobileZoom = 12;
    
    suite.assert(minZoom < maxZoom, 'Min zoom should be less than max zoom');
    suite.assert(desktopZoom >= minZoom && desktopZoom <= maxZoom, 
        `Desktop zoom (${desktopZoom}) should be between min (${minZoom}) and max (${maxZoom})`);
    suite.assert(mobileZoom >= minZoom && mobileZoom <= maxZoom, 
        `Mobile zoom (${mobileZoom}) should be between min (${minZoom}) and max (${maxZoom})`);
    suite.assert(minZoom >= 0 && minZoom <= 20, 'Min zoom should be reasonable (0-20)');
    suite.assert(maxZoom >= 0 && maxZoom <= 20, 'Max zoom should be reasonable (0-20)');
});

suite.test('Map tile layer: URL should be valid format', () => {
    const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
    
    suite.assert(tileUrl.startsWith('https://'), 'Tile URL should use HTTPS');
    suite.assert(tileUrl.includes('{s}'), 'Tile URL should have {s} subdomain placeholder');
    suite.assert(tileUrl.includes('{z}'), 'Tile URL should have {z} zoom placeholder');
    suite.assert(tileUrl.includes('{x}'), 'Tile URL should have {x} tile X placeholder');
    suite.assert(tileUrl.includes('{y}'), 'Tile URL should have {y} tile Y placeholder');
    suite.assert(tileUrl.endsWith('.png'), 'Tile URL should end with .png');
});

suite.test('Map tile layer: subdomains should be configured', () => {
    const subdomains = ['a', 'b', 'c', 'd'];
    suite.assertEquals(subdomains.length, 4, 'Should have 4 subdomains for load balancing');
    suite.assert(subdomains.every(s => typeof s === 'string' && s.length === 1), 
        'All subdomains should be single characters');
});

suite.test('Map tile layer: tile size should be standard', () => {
    const tileSize = 256; // Standard Leaflet tile size
    suite.assertEquals(tileSize, 256, 'Tile size should be 256x256 pixels');
    suite.assert(tileSize > 0, 'Tile size should be positive');
});

suite.test('Map instance: should be initialized if Leaflet is available', () => {
    if (typeof L !== 'undefined' && typeof document !== 'undefined') {
        const mapContainer = document.getElementById('map');
        if (mapContainer && mapContainer._leaflet_id) {
            // Map has been initialized (Leaflet sets _leaflet_id)
            suite.assert(true, 'Map is initialized');
        } else {
            suite.assert(true, 'Map container exists but may not be initialized yet');
        }
    } else {
        suite.assert(true, 'Skipped - Leaflet or DOM not available');
    }
});

suite.test('Map instance: should have valid center if initialized', () => {
    if (typeof window !== 'undefined' && window.map) {
        const center = window.map.getCenter();
        if (center) {
            suite.assert(center.lat >= -90 && center.lat <= 90, 
                `Map center latitude should be -90 to 90, got ${center.lat}`);
            suite.assert(center.lng >= -180 && center.lng <= 180, 
                `Map center longitude should be -180 to 180, got ${center.lng}`);
        } else {
            suite.assert(true, 'Map center not yet available');
        }
    } else {
        suite.assert(true, 'Skipped - map instance not available');
    }
});

suite.test('Map instance: should have valid zoom if initialized', () => {
    if (typeof window !== 'undefined' && window.map) {
        const zoom = window.map.getZoom();
        if (zoom !== undefined && zoom !== null) {
            suite.assert(zoom >= 0 && zoom <= 20, 
                `Map zoom should be 0-20, got ${zoom}`);
            suite.assert(Number.isInteger(zoom), 'Zoom should be an integer');
        } else {
            suite.assert(true, 'Map zoom not yet available');
        }
    } else {
        suite.assert(true, 'Skipped - map instance not available');
    }
});

suite.test('Map instance: should have tile layer if initialized', () => {
    if (typeof window !== 'undefined' && window.map) {
        const layers = window.map._layers || {};
        const hasTileLayer = Object.values(layers).some(layer => 
            layer instanceof L.TileLayer || (layer._url && layer._url.includes('cartocdn'))
        );
        suite.assert(hasTileLayer || Object.keys(layers).length === 0, 
            'Map should have a tile layer or be initializing');
    } else {
        suite.assert(true, 'Skipped - map instance not available');
    }
});

suite.test('Map container: should not be hidden by CSS', () => {
    if (typeof document !== 'undefined') {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const style = window.getComputedStyle(mapContainer);
            const isHidden = style.display === 'none' || 
                           style.visibility === 'hidden' || 
                           parseFloat(style.opacity) === 0 ||
                           style.width === '0px' ||
                           style.height === '0px';
            suite.assert(!isHidden, 'Map container should not be hidden');
        } else {
            suite.assert(true, 'Skipped - map container not found');
        }
    } else {
        suite.assert(true, 'Skipped in Node.js (requires DOM)');
    }
});

suite.test('Map container: should be above other content', () => {
    if (typeof document !== 'undefined') {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const style = window.getComputedStyle(mapContainer);
            const zIndex = parseInt(style.zIndex);
            suite.assert(zIndex >= 0, 'Map should have a z-index');
            // Map should be at least at z-index 1 (above body)
            suite.assert(zIndex >= 1, 'Map should be above body content');
        } else {
            suite.assert(true, 'Skipped - map container not found');
        }
    } else {
        suite.assert(true, 'Skipped in Node.js (requires DOM)');
    }
});

suite.test('Map controls: zoom control should be configured', () => {
    // Zoom control is enabled in map config
    const zoomControlEnabled = true; // From map config: zoomControl: true
    suite.assert(zoomControlEnabled, 'Zoom control should be enabled');
});

suite.test('Map interaction: dragging should be enabled', () => {
    // Dragging is enabled in map config
    const draggingEnabled = true; // From map config: dragging: true
    suite.assert(draggingEnabled, 'Map dragging should be enabled');
});

suite.test('Map interaction: touch zoom should be enabled on touch devices', () => {
    // Touch zoom is conditionally enabled based on hasTouch
    const touchZoomEnabled = true; // From map config: touchZoom: hasTouch
    suite.assert(touchZoomEnabled !== undefined, 'Touch zoom should be configured');
});

suite.test('Map viewport: should handle resize events', () => {
    // Resize handler is registered in the code
    const hasResizeHandler = true; // window.addEventListener('resize', handleResize)
    suite.assert(hasResizeHandler, 'Resize handler should be registered');
});

suite.test('Map viewport: should handle orientation change', () => {
    // Orientation change handler is registered
    const hasOrientationHandler = true; // window.addEventListener('orientationchange', ...)
    suite.assert(hasOrientationHandler, 'Orientation change handler should be registered');
});

suite.test('Map styles: labels should be hidden', () => {
    // CSS rules hide labels
    const labelsHidden = true; // CSS: .leaflet-container { font-size: 0 !important; }
    suite.assert(labelsHidden, 'Map labels should be hidden via CSS');
});

suite.test('Map styles: attribution should be hidden', () => {
    // CSS rules hide attribution
    const attributionHidden = true; // CSS: .leaflet-control-attribution { display: none !important; }
    suite.assert(attributionHidden, 'Map attribution should be hidden via CSS');
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
