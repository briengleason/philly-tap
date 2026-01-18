/**
 * Game State Management
 * Handles localStorage persistence and game state operations
 */

// Game state (must be global for access across modules)
let gameState = {
    currentLocationIndex: 0,  // Index of current location (0-4)
    guesses: {},
    totalScore: 0
};

// Track transition state to prevent location skipping
let isTransitioning = false;
let transitionTimeoutId = null;
let displayUpdateTimeoutId = null;

// Clean up old localStorage entries (keep only current day's data)
function cleanupOldGameState() {
    const today = new Date().toDateString();
    const todayKey = `phillyGame_${today}`;
    
    // Remove all localStorage entries that match the phillyGame_ pattern but aren't today
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('phillyGame_') && key !== todayKey) {
            keysToRemove.push(key);
        }
    }
    
    // Remove old entries
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    if (keysToRemove.length > 0) {
        console.log(`🧹 Cleaned up ${keysToRemove.length} old game state entries`);
    }
}

// Initialize game state from localStorage (for daily persistence)
function loadGameState() {
    // Clean up old entries first
    cleanupOldGameState();
    
    const today = new Date().toDateString();
    const key = `phillyGame_${today}`;
    const saved = localStorage.getItem(key);
    
    console.log(`📂 Loading game state for ${today}...`);
    console.log(`   Key: ${key}`);
    console.log(`   Found saved state: ${saved ? 'Yes' : 'No'}`);
    console.log(`   DEV_MODE: ${DEV_MODE}`);
    
    // Double-check the date matches today (in case the page was open across midnight)
    if (saved && !DEV_MODE) {
        try {
            const parsed = JSON.parse(saved);
            // Ensure currentLocationIndex exists (migration from old format)
            gameState = {
                currentLocationIndex: parsed.currentLocationIndex !== undefined ? parsed.currentLocationIndex : 0,
                guesses: parsed.guesses || {},
                totalScore: parsed.totalScore || 0
            };
            console.log(`✅ Loaded game state:`, {
                currentLocationIndex: gameState.currentLocationIndex,
                guessesCount: Object.keys(gameState.guesses).length,
                totalScore: gameState.totalScore
            });
        } catch (e) {
            // If parsing fails, reset state
            console.warn('Failed to parse saved game state, resetting:', e);
            gameState = {
                currentLocationIndex: 0,
                guesses: {},
                totalScore: 0
            };
        }
    } else {
        // Reset for new day or dev mode
        console.log(`🆕 Starting fresh game (new day or dev mode)`);
        gameState = {
            currentLocationIndex: 0,
            guesses: {},
            totalScore: 0
        };
    }
}

// Save game state to localStorage
function saveGameState() {
    if (!DEV_MODE) {
        const today = new Date().toDateString();
        const key = `phillyGame_${today}`;
        const stateToSave = JSON.stringify(gameState);
        localStorage.setItem(key, stateToSave);
        console.log(`💾 Saved game state:`, {
            key: key,
            currentLocationIndex: gameState.currentLocationIndex,
            guessesCount: Object.keys(gameState.guesses).length,
            totalScore: gameState.totalScore
        });
    } else {
        console.log(`🚫 Skipping save (DEV_MODE is true)`);
    }
    // In dev mode, don't save so it resets on refresh
}
