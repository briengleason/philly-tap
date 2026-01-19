/**
 * Analytics Tracking
 * Simple Google Analytics 4 integration for game metrics
 */

// Initialize Google Analytics (called after GA script loads)
function initAnalytics() {
    if (typeof gtag !== 'undefined') {
        console.log('✅ Analytics initialized');
    } else {
        console.warn('⚠️ Google Analytics not loaded');
    }
}

// Track daily active user (page view)
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': 'Philly Tap',
            'page_location': window.location.href
        });
    }
}

// Track game completion
function trackGameCompleted(totalScore, locationsCompleted, date) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'game_completed', {
            'score': totalScore,
            'locations_completed': locationsCompleted,
            'date': date,
            'value': totalScore
        });
    }
}

// Track location guess
function trackLocationGuess(locationId, locationName, distance, score) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'location_guessed', {
            'location_id': locationId,
            'location_name': locationName,
            'distance_meters': Math.round(distance),
            'score': score,
            'value': score
        });
    }
}

// Track share button click
function trackShareClick(totalScore, date) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'score_shared', {
            'score': totalScore,
            'date': date
        });
    }
}

// Track error
function trackError(errorType, errorMessage) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': `${errorType}: ${errorMessage}`,
            'fatal': false
        });
    }
}

// Track daily active user (on first interaction)
let hasTrackedDailyActive = false;
function trackDailyActive() {
    if (!hasTrackedDailyActive && typeof gtag !== 'undefined') {
        gtag('event', 'daily_active_user', {
            'date': getTodayDateString()
        });
        hasTrackedDailyActive = true;
    }
}
