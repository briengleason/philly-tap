/**
 * Game Logic
 * Core game flow: guessing, preview, confirmation, progression, and initialization
 */

// Show preview of guess before confirmation
function showGuessPreview(tapLatLng) {
    const location = getCurrentLocation();
    
    if (!location) {
        return; // All locations completed
    }
    
    if (gameState.guesses[location.id]) {
        // Already guessed this location, advance to next
        advanceToNextLocation();
        return;
    }
    
    // Clear any existing preview
    clearPreview();
    
    // Store pending guess
    pendingGuess = tapLatLng;
    
    // Create pin at tap location immediately (will be replaced by full markers on confirmation)
    previewMarker = L.marker(tapLatLng, {
        icon: createPinIcon('#2563eb', false)
    }).addTo(map);
    
    // Show confirmation button
    const confirmBtn = document.getElementById('confirm-guess-btn');
    if (confirmBtn) {
        confirmBtn.classList.add('show');
    }
}

// Clear preview marker and hide confirmation button
function clearPreview() {
    if (previewMarker) {
        map.removeLayer(previewMarker);
        previewMarker = null;
    }
    pendingGuess = null;
    
    const confirmBtn = document.getElementById('confirm-guess-btn');
    if (confirmBtn) {
        confirmBtn.classList.remove('show');
    }
}

// Confirm the pending guess (must be globally accessible for onclick)
window.confirmGuess = confirmGuess;
function confirmGuess() {
    if (!pendingGuess) {
        return;
    }
    
    const tapLatLng = pendingGuess;
    // Keep the preview marker - it will become the tap marker
    const existingPreviewMarker = previewMarker;
    
    // Clear preview state (marker is now owned by makeGuess)
    pendingGuess = null;
    previewMarker = null;
    
    // Hide confirmation button
    const confirmBtn = document.getElementById('confirm-guess-btn');
    if (confirmBtn) {
        confirmBtn.classList.remove('show');
    }
    
    // Make the guess (will create line and location marker, reusing preview pin)
    makeGuess(tapLatLng, existingPreviewMarker);
}

// Make a guess for the current location (called after confirmation)
function makeGuess(tapLatLng, existingTapMarker = null) {
    // Prevent processing during transition to avoid location skipping
    if (isTransitioning) {
        return;
    }
    
    const location = getCurrentLocation();
    
    if (!location) {
        return; // All locations completed
    }
    
    if (gameState.guesses[location.id]) {
        // Already guessed this location, advance to next
        advanceToNextLocation();
        return;
    }
    
    // Calculate distance
    const distance = calculateDistance(
        location.coordinates[0],
        location.coordinates[1],
        tapLatLng.lat,
        tapLatLng.lng
    );
    
    // Calculate base score
    let baseScore = calculateScore(distance);
    
    // Apply multipliers for later locations
    let finalScore = baseScore;
    if (location.id === 2) {
        // Location 3 (id 2) gets x2 multiplier
        finalScore = Math.round(baseScore * 2);
    } else if (location.id === 3 || location.id === 4) {
        // Locations 4-5 (ids 3, 4) get x3 multiplier
        finalScore = Math.round(baseScore * 3);
    }
    
    // Store guess (save latlng as plain object for JSON serialization)
    gameState.guesses[location.id] = {
        latlng: { lat: tapLatLng.lat, lng: tapLatLng.lng },
        distance: distance,
        baseScore: baseScore,
        score: finalScore
    };
    
    // Update total score
    gameState.totalScore = Object.values(gameState.guesses).reduce((sum, g) => sum + g.score, 0);
    
    // Track location guess (for difficulty analysis)
    trackLocationGuess(location.id, location.name, distance, finalScore);
    
    // Create markers and line (reuse existing tap marker if provided)
    createMarkersAndLine(location.id, tapLatLng, distance, existingTapMarker);
    
    // Show quick score (show base score before multipliers)
    showQuickScore(baseScore);
    
    // Save state
    saveGameState();
    
    // Update UI
    updateRunningScore();
    
    // Set transitioning flag to prevent multiple simultaneous transitions
    isTransitioning = true;
    
    // Clear any existing transition timeouts
    if (transitionTimeoutId) {
        clearTimeout(transitionTimeoutId);
    }
    if (displayUpdateTimeoutId) {
        clearTimeout(displayUpdateTimeoutId);
    }
    
    // Fade out current location, then show transition and advance
    const currentLocationEl = document.getElementById('current-location');
    currentLocationEl.classList.add('fade-out');
    
    transitionTimeoutId = setTimeout(() => {
        // Find next unguessed location
        // Move to the next location index
        let nextIndex = gameState.currentLocationIndex + 1;
        
        // Skip any already-guessed locations
        while (nextIndex < locations.length) {
            const testLocation = locations[nextIndex];
            if (!gameState.guesses[testLocation.id]) {
                // Found next unguessed location
                break;
            }
            // This location is already guessed, move to next
            nextIndex++;
        }
        
        // Update the current location index only if we found a valid next location
        if (nextIndex < locations.length) {
            gameState.currentLocationIndex = nextIndex;
        } else {
            // All locations completed
            gameState.currentLocationIndex = locations.length;
        }
        
        // If we've completed all locations, show completion screen
        if (gameState.currentLocationIndex >= locations.length) {
            showCompletionScreen();
            saveGameState();
            isTransitioning = false;
        } else {
            // Show transition overlay with next location
            const nextLocation = locations[gameState.currentLocationIndex];
            showNextLocationTransition(nextLocation);
            
            // Update display after transition
            displayUpdateTimeoutId = setTimeout(() => {
                updateCurrentLocationDisplay(true);
                saveGameState();
                isTransitioning = false;
            }, 2100);
        }
        transitionTimeoutId = null;
    }, 500);
}

// Advance to next location (used when already guessed)
function advanceToNextLocation() {
    // Prevent processing during transition to avoid location skipping
    if (isTransitioning) {
        return;
    }
    
    // Set transitioning flag
    isTransitioning = true;
    
    // Clear any existing transition timeouts
    if (transitionTimeoutId) {
        clearTimeout(transitionTimeoutId);
    }
    if (displayUpdateTimeoutId) {
        clearTimeout(displayUpdateTimeoutId);
    }
    
    // Find next unguessed location
    while (gameState.currentLocationIndex < locations.length) {
        const location = locations[gameState.currentLocationIndex];
        if (!gameState.guesses[location.id]) {
            // Found next unguessed location
            break;
        }
        gameState.currentLocationIndex++;
    }
    
    // If we've completed all locations, show completion screen
    if (gameState.currentLocationIndex >= locations.length) {
        showCompletionScreen();
        isTransitioning = false;
    } else {
        const nextLocation = locations[gameState.currentLocationIndex];
        showNextLocationTransition(nextLocation);
        displayUpdateTimeoutId = setTimeout(() => {
            updateCurrentLocationDisplay(true);
            isTransitioning = false;
        }, 2100);
    }
    
    saveGameState();
}

// Restore markers for completed guesses
function restoreMarkers() {
    Object.keys(gameState.guesses).forEach(locationId => {
        const locationIdNum = parseInt(locationId);
        const guess = gameState.guesses[locationIdNum];
        if (guess && guess.latlng) {
            // Convert stored latlng back to Leaflet LatLng object
            const tapLatLng = L.latLng(guess.latlng.lat, guess.latlng.lng);
            createMarkersAndLine(
                locationIdNum,
                tapLatLng,
                guess.distance
            );
        }
    });
}

// Initialize game (called after locations are loaded)
function initializeGame() {
    // Load game state from localStorage (must be called first to restore state)
    loadGameState();
    
    // Validate game state against current locations
    // Filter out any guesses for locations that don't exist in today's set
    const validLocationIds = new Set(locations.map(loc => loc.id));
    const validGuesses = {};
    let hasValidGuesses = false;
    
    Object.keys(gameState.guesses).forEach(locationId => {
        const id = parseInt(locationId);
        if (validLocationIds.has(id) && gameState.guesses[locationId]) {
            validGuesses[locationId] = gameState.guesses[locationId];
            hasValidGuesses = true;
        }
    });
    
    // Update game state with only valid guesses
    gameState.guesses = validGuesses;
    
    // Recalculate total score based on valid guesses
    gameState.totalScore = Object.values(validGuesses).reduce((sum, guess) => {
        return sum + (guess.score || 0);
    }, 0);
    
    // Restore game state - find first unguessed location
    if (hasValidGuesses) {
        // Find first unguessed location
        let foundUnguessed = false;
        for (let i = 0; i < locations.length; i++) {
            if (!gameState.guesses[locations[i].id]) {
                gameState.currentLocationIndex = i;
                foundUnguessed = true;
                break;
            }
        }
        // If all locations are guessed, set index to locations.length
        if (!foundUnguessed) {
            gameState.currentLocationIndex = locations.length;
        }
        // If all guessed, show completion
        if (gameState.currentLocationIndex >= locations.length) {
            showCompletionScreen();
        } else {
            // Game in progress - ensure panel is not minimized and button is hidden
            const gamePanel = document.getElementById('game-panel');
            const minimizeBtn = document.getElementById('minimize-btn');
            if (gamePanel) {
                gamePanel.classList.remove('minimized');
            }
            if (minimizeBtn) {
                minimizeBtn.style.display = 'none';
            }
        }
    } else {
        // No valid guesses, start fresh
        gameState.currentLocationIndex = 0;
        // Ensure panel is not minimized and button is hidden
        const gamePanel = document.getElementById('game-panel');
        const minimizeBtn = document.getElementById('minimize-btn');
        if (gamePanel) {
            gamePanel.classList.remove('minimized');
        }
        if (minimizeBtn) {
            minimizeBtn.style.display = 'none';
        }
    }
    
    // Save validated state
    saveGameState();
    
    // Initialize UI
    updateCurrentLocationDisplay(false); // Don't animate on initial load
    updateRunningScore();
    restoreMarkers();
    
    // Add pulse animation after a short delay to indicate user should tap
    setTimeout(() => {
        const iconEl = document.getElementById('current-location-icon');
        if (iconEl) {
            iconEl.classList.add('pulse');
        }
    }, 1000);
}
