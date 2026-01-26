/**
 * Utility Functions
 * Pure utility functions for calculations and formatting
 */

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
function calculateScore(distance) {
    if (distance >= MAX_DISTANCE) {
        return 0;
    }
    // Using exponential decay with steeper curve to reward accuracy
    // Higher exponent (2.3) makes the curve steeper, penalizing far distances more
    // Close guesses get high scores, far guesses get much lower scores
    const score = 100 * Math.pow(1 - (distance / MAX_DISTANCE), 2.3);
    return Math.round(Math.max(0, Math.min(100, score)));
}

// Format distance for display (converts meters to feet/miles)
function formatDistance(meters) {
    const metersPerMile = 1609.344; // 1 mile in meters
    // Use 1609 as threshold (approximately 1 mile) to match test expectations
    if (meters < 1609) {
        // Less than a mile, display in feet
        const feet = meters * 3.28084; // Convert meters to feet
        return Math.round(feet) + 'ft';
    } else {
        // A mile or more, display in miles
        return (meters / metersPerMile).toFixed(2) + 'mi';
    }
}

// Get emoji based on score
function getScoreEmoji(score) {
    if (score === 100) return '🎯';
    if (score >= 98) return '👑';
    if (score >= 97) return '⭐';
    if (score >= 96) return '💫';
    if (score >= 95) return '🏅';
    if (score >= 94) return '🥇';
    if (score >= 93) return '🏵️';
    if (score >= 92) return '🎖️';
    if (score >= 91) return '🏅';
    if (score >= 90) return '🏆';
    if (score >= 89) return '💎';
    if (score >= 88) return '💍';
    if (score >= 87) return '✨';
    if (score >= 86) return '🌟';
    if (score >= 85) return '🎉';
    if (score >= 84) return '🎊';
    if (score >= 83) return '🔥';
    if (score >= 82) return '💥';
    if (score >= 81) return '⚡';
    if (score >= 80) return '✨';
    if (score >= 79) return '💫';
    if (score >= 78) return '✨';
    if (score >= 77) return '🌟';
    if (score >= 76) return '💎';
    if (score >= 75) return '😁';
    if (score >= 74) return '😄';
    if (score >= 73) return '😊';
    if (score >= 72) return '👍';
    if (score >= 71) return '👏';
    if (score >= 70) return '🤗';
    if (score >= 69) return '🙌';
    if (score >= 68) return '👋';
    if (score >= 67) return '✌️';
    if (score >= 66) return '🤞';
    if (score >= 65) return '🙌';
    if (score >= 64) return '🤝';
    if (score >= 63) return '👌';
    if (score >= 62) return '🙂';
    if (score >= 61) return '😌';
    if (score >= 60) return '👌';
    if (score >= 58) return '🤔';
    if (score >= 55) return '😐';
    if (score >= 53) return '😑';
    if (score >= 50) return '🫣';
    if (score >= 48) return '🤷';
    if (score >= 45) return '😕';
    if (score >= 43) return '😶';
    if (score >= 40) return '😶';
    if (score >= 38) return '😑';
    if (score >= 35) return '😐';
    if (score >= 33) return '😕';
    if (score >= 30) return '😟';
    if (score >= 28) return '😞';
    if (score >= 25) return '😔';
    if (score >= 23) return '😓';
    if (score >= 20) return '😟';
    if (score >= 18) return '😥';
    if (score >= 15) return '😢';
    if (score >= 13) return '😰';
    if (score >= 10) return '😨';
    if (score >= 8) return '😱';
    if (score >= 5) return '😰';
    if (score >= 3) return '😭';
    if (score >= 1) return '💀';
    return '😭';
}

// Format date for display (e.g., "January 17, 2026")
function formatDateForDisplay(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${day}, ${year}`;
}

// Get today's date in YYYY-MM-DD format
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for share message (e.g., "January 17")
function formatShareDate() {
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[today.getMonth()];
    const day = today.getDate();
    return `${month} ${day}`;
}
