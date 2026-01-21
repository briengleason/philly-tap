/**
 * Configuration and Constants
 * Global configuration values and device detection
 */

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                (window.matchMedia && window.matchMedia("(max-width: 767px)").matches);

const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Maximum distance for scoring (in meters) - beyond this gives 0 points
// Increased from 5000 to 10000 to reduce zero scores (covers ~6 miles radius)
const MAX_DISTANCE = 8000;

// Developer mode flag (set to true to enable reset functionality)
const DEV_MODE = false; // Change to true for development/testing
