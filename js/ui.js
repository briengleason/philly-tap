/**
 * UI Management
 * Handles DOM updates, modals, displays, and user interface interactions
 */

// Show quick score popup
function showQuickScore(score) {
    const quickScore = document.getElementById('quick-score');
    const quickScoreValue = document.getElementById('quick-score-value');
    
    quickScoreValue.textContent = score;
    quickScore.classList.remove('hide');
    quickScore.classList.add('show');
    
    setTimeout(() => {
        quickScore.classList.remove('show');
        quickScore.classList.add('hide');
    }, 2000);
}

// Get current location
function getCurrentLocation() {
    if (gameState.currentLocationIndex >= locations.length) {
        return null; // All locations completed
    }
    return locations[gameState.currentLocationIndex];
}

// Update UI to show current location
function updateCurrentLocationDisplay(animate = true) {
    const location = getCurrentLocation();
    
    if (!location) {
        // All locations completed
        showCompletionScreen();
        return;
    }
    
    const currentLocationEl = document.getElementById('current-location');
    const iconEl = document.getElementById('current-location-icon');
    
    // Remove fade classes
    currentLocationEl.classList.remove('fade-out', 'fade-in');
    iconEl.classList.remove('pulse');
    
    if (animate) {
        // Fade in animation
        currentLocationEl.classList.add('fade-in');
        // Add pulse animation to icon to indicate user should tap
        setTimeout(() => {
            iconEl.classList.add('pulse');
        }, 500);
    }
    
    // Update progress indicator
    document.getElementById('current-location-number').textContent = gameState.currentLocationIndex + 1;
    document.getElementById('total-locations').textContent = locations.length;
    
    // Get multiplier for this location
    let multiplier = 1;
    if (location.id === 2) {
        multiplier = 2; // Location 3 (id 2) gets x2 multiplier
    } else if (location.id === 3 || location.id === 4) {
        multiplier = 3; // Locations 4-5 (ids 3, 4) get x3 multiplier
    }
    
    // Update multiplier indicator
    const multiplierEl = document.getElementById('multiplier-indicator');
    if (multiplier > 1) {
        multiplierEl.textContent = `×${multiplier} points`;
        multiplierEl.style.display = 'block';
    } else {
        multiplierEl.textContent = '';
        multiplierEl.style.display = 'none';
    }
    
    // Update current location display - check if photo exists
    const photoContainer = document.getElementById('current-location-photo-container');
    const photoImg = document.getElementById('current-location-photo');
    const displayContainer = document.getElementById('current-location-display');
    
    if (location.photo) {
        // Show photo, hide icon/name display
        photoImg.src = location.photo;
        photoImg.onerror = () => {
            // If photo fails to load, show icon/name instead
            photoContainer.style.display = 'none';
            displayContainer.style.display = 'flex';
        };
        photoContainer.style.display = 'flex';
        displayContainer.style.display = 'none';
    } else {
        // Show icon and name
        photoContainer.style.display = 'none';
        displayContainer.style.display = 'flex';
        iconEl.textContent = location.icon;
    }
    
    // Update location name with info button
    const locationNameEl = document.getElementById('current-location-name');
    const nameSpan = locationNameEl.querySelector('span:first-child');
    let currentInfoBtn = document.getElementById('location-info-btn');
    
    // Update name text
    if (nameSpan) {
        nameSpan.textContent = location.name;
    } else {
        // Shouldn't happen, but create structure if missing
        locationNameEl.innerHTML = `<span>${location.name}</span><span id="location-info-btn" style="display: none;" onclick="showLocationInfo()" title="Learn more">ℹ️</span>`;
        currentInfoBtn = document.getElementById('location-info-btn');
    }
    
    // Ensure info button exists (create if missing)
    if (!currentInfoBtn) {
        const infoBtnSpan = document.createElement('span');
        infoBtnSpan.id = 'location-info-btn';
        infoBtnSpan.textContent = 'ℹ️';
        infoBtnSpan.setAttribute('onclick', 'showLocationInfo()');
        infoBtnSpan.setAttribute('title', 'Learn more');
        infoBtnSpan.style.display = 'none';
        locationNameEl.appendChild(infoBtnSpan);
        currentInfoBtn = infoBtnSpan;
    }
    
    // Hide info button during gameplay - descriptions only shown on completion screen
    if (currentInfoBtn) {
        currentInfoBtn.style.display = 'none';
    }
    
    // Check if already guessed
    const guess = gameState.guesses[location.id];
    if (guess) {
        document.getElementById('current-location-instruction').textContent = 
            `✓ ${formatDistance(guess.distance)} away - ${guess.score} points`;
    } else {
        document.getElementById('current-location-instruction').textContent = 
            'Tap the location on the map';
    }
}

// Show location info modal
function showLocationInfo(location = null) {
    // If no location provided, try to get current location
    if (!location) {
        location = getCurrentLocation();
    }
    if (!location) return;
    
    const modal = document.getElementById('location-info-modal');
    const overlay = document.getElementById('location-info-overlay');
    const title = document.getElementById('location-info-title');
    const icon = document.getElementById('location-info-icon');
    const content = document.getElementById('location-info-content');
    const photoContainer = document.getElementById('location-info-photo-container');
    const photoImg = document.getElementById('location-info-photo');
    
    // Update modal content
    icon.textContent = location.icon || '📍';
    title.textContent = location.name;
    
    // Show photo if available
    if (location.photo) {
        photoImg.src = location.photo;
        photoImg.onerror = () => {
            // If photo fails to load, hide photo container
            photoContainer.style.display = 'none';
        };
        photoContainer.style.display = 'block';
    } else {
        photoContainer.style.display = 'none';
    }
    
    // Show description if available, otherwise show default message
    if (location.description && location.description.trim()) {
        content.textContent = location.description;
    } else {
        content.textContent = 'No information available for this location.';
    }
    
    // Show modal and overlay
    overlay.classList.add('show');
    modal.classList.add('show');
    
    // Prevent body scroll on mobile
    document.body.style.overflow = 'hidden';
}

// Hide location info modal
function hideLocationInfo() {
    const modal = document.getElementById('location-info-modal');
    const overlay = document.getElementById('location-info-overlay');
    
    if (modal) modal.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Toggle minimize state of game panel
function toggleMinimize() {
    const gamePanel = document.getElementById('game-panel');
    const minimizeBtn = document.getElementById('minimize-btn');
    
    if (gamePanel.classList.contains('minimized')) {
        gamePanel.classList.remove('minimized');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = 'Minimize';
    } else {
        gamePanel.classList.add('minimized');
        minimizeBtn.textContent = '+';
        minimizeBtn.title = 'Expand';
    }
}

// Show transition overlay for next location
function showNextLocationTransition(nextLocation) {
    const overlay = document.getElementById('next-location-overlay');
    const message = document.getElementById('next-location-message');
    const photoContainer = document.getElementById('next-location-photo-container');
    const photoImg = document.getElementById('next-location-photo');
    const displayContainer = document.getElementById('next-location-display');
    const icon = document.getElementById('next-location-icon');
    const name = document.getElementById('next-location-name');
    
    // Check if location has a photo
    if (nextLocation.photo) {
        // Show photo, hide icon/name
        photoImg.src = nextLocation.photo;
        photoContainer.style.display = 'block';
        displayContainer.style.display = 'none';
    } else {
        // Show icon and name, hide photo
        photoContainer.style.display = 'none';
        displayContainer.style.display = 'block';
        icon.textContent = nextLocation.icon;
        name.textContent = nextLocation.name;
    }
    
    // Show overlay
    overlay.classList.add('show');
    
    // Hide overlay after animation
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 2000);
}

// Update running score display
function updateRunningScore() {
    document.getElementById('running-score-value').textContent = gameState.totalScore;
}

// Generate share message
function generateShareMessage() {
    const url = 'playphillytap.com';
    const date = formatShareDate();
    
    // Sort locations by their original order (by id)
    const sortedLocations = locations.slice().sort((a, b) => a.id - b.id);
    
    // Build score string with emojis (using base scores, not multiplied)
    const scoreParts = sortedLocations.map(location => {
        const guess = gameState.guesses[location.id];
        if (guess) {
            // Use baseScore for share message (1-100 range)
            const baseScore = guess.baseScore !== undefined ? guess.baseScore : guess.score;
            const emoji = getScoreEmoji(baseScore);
            return `${baseScore}${emoji}`;
        }
        return '';
    }).filter(part => part !== '');
    
    const scoreString = scoreParts.join(' ');
    const finalScore = gameState.totalScore;
    
    return `${url}\n${date}\n${scoreString}\nFinal score: ${finalScore}`;
}

// Share score using Web Share API (mobile) or clipboard (desktop)
async function shareScore() {
    try {
        const message = generateShareMessage();
        
        // Try Web Share API first (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share({
                    text: message,
                });
                
                // Track share button click
                trackShareClick(gameState.totalScore, getTodayDateString());
                return; // Successfully shared via native share
            } catch (shareError) {
                // User cancelled share or share failed, fall through to clipboard
                if (shareError.name !== 'AbortError') {
                    console.log('Web Share API failed, falling back to clipboard:', shareError);
                } else {
                    // User cancelled, don't show error
                    return;
                }
            }
        }
        
        // Fallback to Clipboard API (desktop or if Web Share not available)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(message);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = message;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        // Track share button click
        trackShareClick(gameState.totalScore, getTodayDateString());
        
        // Show feedback
        const feedback = document.getElementById('share-feedback');
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
        
    } catch (error) {
        console.error('Failed to share:', error);
        trackError('share_failed', error.message);
        alert('Failed to share. Please copy manually:\n\n' + generateShareMessage());
    }
}

// Show completion screen
function showCompletionScreen() {
    document.getElementById('game-content').style.display = 'none';
    document.getElementById('completion-screen').classList.add('show');
    document.getElementById('final-score').textContent = gameState.totalScore;
    
    // Track game completion
    trackGameCompleted(
        gameState.totalScore,
        Object.keys(gameState.guesses).length,
        getTodayDateString()
    );
    
    // Show minimize button (panel defaults to maximized/expanded)
    const minimizeBtn = document.getElementById('minimize-btn');
    const gamePanel = document.getElementById('game-panel');
    if (minimizeBtn) {
        minimizeBtn.style.display = 'block';
        // Set button to show minimize option (since panel is expanded)
        minimizeBtn.textContent = '−';
        minimizeBtn.title = 'Minimize';
    }
    // Ensure panel is not minimized (defaults to maximized)
    if (gamePanel && gamePanel.classList.contains('minimized')) {
        gamePanel.classList.remove('minimized');
    }
    
    // Populate results table
    const tableBody = document.getElementById('results-table-body');
    tableBody.innerHTML = '';
    
    // Sort locations by their original order (by id)
    const sortedLocations = locations.slice().sort((a, b) => a.id - b.id);
    
    sortedLocations.forEach(location => {
        const guess = gameState.guesses[location.id];
        if (guess) {
            // Get multiplier for this location
            let multiplier = 1;
            if (location.id === 2) {
                multiplier = 2; // Location 3 (id 2) gets x2 multiplier
            } else if (location.id === 3 || location.id === 4) {
                multiplier = 3; // Locations 4-5 (ids 3, 4) get x3 multiplier
            }
            
            // Get base score (before multiplier)
            const baseScore = guess.baseScore !== undefined ? guess.baseScore : guess.score;
            const finalScore = guess.score;
            
            // Format score display
            let scoreDisplay;
            if (multiplier > 1) {
                // Show: baseScore × multiplier = finalScore
                scoreDisplay = `${baseScore} <span class="multiplier">×${multiplier}</span> <span class="equals">=</span> ${finalScore}`;
            } else {
                // No multiplier, just show the score
                scoreDisplay = `${finalScore}`;
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="location-icon">${location.icon}</td>
                <td class="location-name">${location.name}</td>
                <td class="distance">${formatDistance(guess.distance)}</td>
                <td class="score">${scoreDisplay}</td>
            `;
            
            // Make row clickable to show location info
            row.addEventListener('click', () => {
                showLocationInfo(location);
            });
            
            tableBody.appendChild(row);
        }
    });
}

// Photo modal functions
function openPhotoModal() {
    const modal = document.getElementById('photo-modal');
    const modalImage = document.getElementById('photo-modal-image');
    const photoImg = document.getElementById('current-location-photo');
    
    if (photoImg.src) {
        modalImage.src = photoImg.src;
        modal.classList.add('show');
    }
}

// Open photo modal from location info modal
function openPhotoModalFromInfo() {
    const modal = document.getElementById('photo-modal');
    const modalImage = document.getElementById('photo-modal-image');
    const photoImg = document.getElementById('location-info-photo');
    
    if (photoImg.src) {
        modalImage.src = photoImg.src;
        modal.classList.add('show');
    }
}

function closePhotoModal(event) {
    // Close modal when:
    // 1. Clicking the image itself
    // 2. Clicking outside the content area
    if (event && event.target.id !== 'photo-modal' && event.target.id !== 'photo-modal-image') {
        return;
    }
    
    const modal = document.getElementById('photo-modal');
    modal.classList.remove('show');
}

// Toggle menu
function toggleMenu() {
    const menuModal = document.getElementById('menu-modal');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!menuModal || !menuOverlay) return;
    
    const isOpen = menuModal.classList.contains('show');
    
    if (isOpen) {
        menuModal.classList.remove('show');
        menuOverlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        menuModal.classList.add('show');
        menuOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}
