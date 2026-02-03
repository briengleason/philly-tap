/**
 * Main Initialization
 * Sets up event handlers, initializes the application, and exposes global functions
 */

// Make functions globally accessible for inline onclick handlers
window.showLocationInfo = showLocationInfo;
window.hideLocationInfo = hideLocationInfo;
window.toggleMinimize = toggleMinimize;
window.toggleMenu = toggleMenu;
window.shareScore = shareScore;
window.openPhotoModal = openPhotoModal;
window.openPhotoModalFromInfo = openPhotoModalFromInfo;
window.closePhotoModal = closePhotoModal;

// Set up location info modal event handlers
const modalEl = document.getElementById('location-info-modal');
const overlayEl = document.getElementById('location-info-overlay');
const closeBtn = document.getElementById('location-info-close');

if (modalEl) {
    // Prevent modal from closing when clicking inside it
    modalEl.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

if (overlayEl) {
    // Close on overlay click (backup to onclick)
    overlayEl.addEventListener('click', hideLocationInfo);
}

if (closeBtn) {
    // Close on close button click (backup to onclick)
    closeBtn.addEventListener('click', hideLocationInfo);
}

// Set up menu modal event handlers
const menuModalEl = document.getElementById('menu-modal');
const menuOverlayEl = document.getElementById('menu-overlay');
const menuCloseBtn = document.getElementById('menu-close');

if (menuCloseBtn) {
    // Close on close button click
    menuCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
}

if (menuModalEl) {
    // Prevent menu from closing when clicking inside it (but allow close button)
    menuModalEl.addEventListener('click', (e) => {
        // Check if click is on or inside the close button
        if (e.target.closest('#menu-close')) {
            // Let the close button handler handle it
            return;
        }
        // Stop propagation for other clicks inside the modal
        e.stopPropagation();
    });
}

if (menuOverlayEl) {
    // Close on overlay click
    menuOverlayEl.addEventListener('click', (e) => {
        // Only close if clicking directly on overlay, not through modal
        if (e.target === menuOverlayEl) {
            toggleMenu();
        }
    });
}

// Track if user is dragging to distinguish from taps
let isDragging = false;
let dragStartTime = 0;
let dragStartPos = null;

// Handle map clicks/taps
map.on('mousedown', (e) => {
    dragStartTime = Date.now();
    dragStartPos = e.containerPoint;
    isDragging = false;
});

map.on('mousemove', () => {
    if (dragStartPos) {
        isDragging = true;
    }
});

map.on('click', (e) => {
    // Track daily active user on first interaction
    trackDailyActive();
    
    // Only process if it's a click, not a drag
    const clickDuration = Date.now() - dragStartTime;
    if (isDragging || clickDuration > 200) {
        return;
    }
    
    // Don't process map clicks if clicking on a marker (markers handle their own clicks)
    if (e.originalEvent && e.originalEvent.target && 
        (e.originalEvent.target.closest('.leaflet-marker-icon') || 
         e.originalEvent.target.closest('.custom-pin'))) {
        return;
    }
    
    // Don't process if clicking on confirmation button
    if (e.originalEvent && e.originalEvent.target && 
        e.originalEvent.target.closest('#confirm-guess-btn')) {
        return;
    }
    
    const clickedLatLng = e.latlng;
    showGuessPreview(clickedLatLng);
});

// Handle touch events for mobile
let touchStartTime = 0;
let touchStartPos = null;
let touchMoved = false;
let touchStartLatLng = null;

map.getContainer().addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        touchStartTime = Date.now();
        const rect = map.getContainer().getBoundingClientRect();
        touchStartPos = { 
            x: e.touches[0].clientX - rect.left, 
            y: e.touches[0].clientY - rect.top 
        };
        touchMoved = false;
        const containerPoint = L.point(touchStartPos.x, touchStartPos.y);
        touchStartLatLng = map.containerPointToLatLng(containerPoint);
    }
}, { passive: true });

map.getContainer().addEventListener('touchmove', (e) => {
    if (touchStartPos && e.touches.length === 1) {
        const moveX = Math.abs(e.touches[0].clientX - touchStartPos.x);
        const moveY = Math.abs(e.touches[0].clientY - touchStartPos.y);
        if (moveX > 5 || moveY > 5) {
            touchMoved = true;
        }
    }
}, { passive: true });

map.getContainer().addEventListener('touchend', (e) => {
    if (touchMoved || !touchStartPos || !touchStartLatLng) {
        touchStartPos = null;
        touchStartLatLng = null;
        return;
    }
    
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration > 300) {
        touchStartPos = null;
        touchStartLatLng = null;
        return;
    }
    
    // Track daily active user on first interaction
    trackDailyActive();
    
    // Use the stored lat/lng from touchstart
    const clickedLatLng = touchStartLatLng;
    showGuessPreview(clickedLatLng);
    
    touchStartPos = null;
    touchStartLatLng = null;
}, { passive: true });

// Adjust game panel and menu button position based on banner height
function adjustPositionsForBanner() {
    const banner = document.getElementById('weekend-banner');
    const gamePanel = document.getElementById('game-panel');
    const menuBtn = document.getElementById('menu-btn');
    
    if (!banner || banner.style.display === 'none') {
        // No banner, use default positions
        if (gamePanel) {
            gamePanel.style.top = window.innerWidth <= 767 ? '10px' : '20px';
        }
        if (menuBtn) {
            menuBtn.style.top = window.innerWidth <= 767 ? '10px' : '20px';
        }
        return;
    }
    
    // Get actual banner height
    const bannerHeight = banner.offsetHeight;
    const offset = bannerHeight + (window.innerWidth <= 767 ? 10 : 20);
    
    if (gamePanel) {
        gamePanel.style.top = `${offset}px`;
    }
    if (menuBtn) {
        menuBtn.style.top = `${offset}px`;
    }
}

// Show weekend banner if it's Saturday or Sunday
function showWeekendBanner() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    const banner = document.getElementById('weekend-banner');
    const bannerContent = document.getElementById('weekend-banner-content');
    
    if (!banner || !bannerContent) return;
    
    if (dayOfWeek === 0) {
        // Saturday
        bannerContent.textContent = 'Tomorrow is the last day to play PhillyTap - thank you everyone for playing and sharing!';
        banner.style.display = 'flex';
        // Wait for banner to render, then adjust positions
        setTimeout(() => {
            adjustPositionsForBanner();
        }, 100);
    } else if (dayOfWeek === 1) {
        // Sunday
        bannerContent.textContent = 'Today is the last day to play PhillyTap - thank you everyone for playing!';
        banner.style.display = 'flex';
        // Wait for banner to render, then adjust positions
        setTimeout(() => {
            adjustPositionsForBanner();
        }, 100);
    } else {
        // Not weekend, hide banner
        banner.style.display = 'none';
        adjustPositionsForBanner();
    }
}

// Track page view on load
document.addEventListener('DOMContentLoaded', () => {
    trackPageView();
    showWeekendBanner();
    
    // Adjust positions when window is resized or orientation changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            adjustPositionsForBanner();
        }, 100);
    });
    
    // Also adjust on orientation change (mobile)
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            adjustPositionsForBanner();
        }, 200);
    });
});

// Start loading locations when page loads
loadLocations();
