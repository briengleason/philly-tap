# Project Context: Philly Tap

## Overview

**Philly Tap** is a daily location-guessing game for Philadelphia landmarks. Users must identify 5 different locations each day by tapping on an interactive map, receiving scores based on proximity to the actual locations. The game features sequential location display with smooth animations, shareable score results, and comprehensive test coverage.

**Live Site**: https://playphillytap.com

## Project Evolution & Development Summary

### Phase 1: Initial Setup
- Created basic map interface with Leaflet.js
- Centered on Philadelphia with no labels for clean aesthetic
- Made responsive for both desktop and mobile

### Phase 2: Core Game Mechanics
- Added single location guessing (Liberty Bell)
- Implemented distance calculation using Haversine formula
- Created exponential decay scoring system (0-100 points)

### Phase 3: Multi-Location Daily Game
- Expanded to 5 locations per day
- Externalized locations to YAML configuration file
- Implemented daily game state persistence with localStorage
- Added aggregated scoring across all locations

### Phase 4: Sequential Game Flow & UX
- Replaced simultaneous location selection with sequential display
- Added smooth animations and transitions between locations
- Implemented "next location" overlay with pulsing icon
- Fixed location skipping bugs through careful index management

### Phase 5: Share Functionality
- Added emoji-based scoring (🎯 for perfect, 🏅 for excellent, etc.)
- Implemented share score button with clipboard API
- Generated formatted share messages: `playphillytap.com January 17 96🏅 100🎯...`

### Phase 6: Testing & Quality Assurance
- Built comprehensive test suite (119+ tests)
- Added tests for all game logic, share functionality, and map rendering
- Created pre-commit hooks to automatically run tests before commits
- Established test-first development workflow
- Added transition guard tests to prevent location skipping regression
- Tests verify critical timing: `isTransitioning` flag set BEFORE `setTimeout`

### Phase 7: Deployment & Automation
- Deployed to GitHub Pages
- Set up automatic syncing with GitHub (post-commit hook)
- Organized code into logical directory structure
- Created comprehensive documentation

### Phase 8: UI Enhancements & Location Information
- Added location descriptions to YAML configuration
- Implemented clickable location pins to show descriptions after guessing
- Made completion screen table rows clickable to view location info
- Added transparent modal/bottom sheet for location information
- Implemented minimized scorecard that shows score in top-right corner
- Added minimize/expand functionality for scorecard (only on completion screen)
- Scorecard defaults to maximized when completion screen appears
- Minimize button only appears on completion screen (hidden during gameplay)
- Updated language from "finding locations" to "guessing locations"
- Made all UI elements transparent to keep map as focal point
- Reduced scorecard size and clutter

### Phase 9: Guess Confirmation Flow
- Added confirmation button that appears when user taps the map
- Preview pin appears immediately at tap location (before confirmation)
- Line connecting to actual location and red location marker only appear after confirmation
- User can tap elsewhere to change guess before confirming
- Improved user control over guess placement before finalizing
- Green confirmation button with checkmark icon positioned at bottom center
- Confirmation button automatically hides after guess is processed

### Phase 10: Code Organization & Refactoring
- Extracted CSS from inline styles to `css/styles.css` (858 lines)
- Organized JavaScript into 8 modular files with clear separation of concerns:
  - `js/config.js` - Configuration constants (device detection, MAX_DISTANCE, DEV_MODE)
  - `js/utils.js` - Utility functions (distance, score, formatting, emoji mapping)
  - `js/gameState.js` - Game state management (localStorage, save/load, cleanup)
  - `js/locations.js` - Location loading from YAML and date management
  - `js/map.js` - Map initialization, pin icons, marker management, map events
  - `js/ui.js` - UI updates (modals, displays, share, completion screen)
  - `js/gameLogic.js` - Core game logic (guessing, preview, confirmation, progression)
  - `js/main.js` - Initialization and event handlers setup
- Reduced `index.html` from 2,423 lines to ~106 lines
- Maintained all functionality while improving code maintainability
- All global functions properly exposed for HTML onclick handlers
- Scripts load in correct dependency order
- Fixed `formatDistance` threshold issue (now uses `meters < 1609` instead of `feet < 5280`)

### Phase 11: Multiplier Visibility & Score Transparency
- Added multiplier indicators to help users understand scoring system
- Multiplier shown under "Location X of 5" progress indicator (displays "×2 points" or "×3 points" for applicable locations)
- Final scorecard now shows base score, multiplier, and final score: "100 ×2 = 200" format
- Locations without multipliers (1-2) show just the final score
- Improved user understanding of why later locations are worth more points
- Fixed game state persistence issue by adding `loadGameState()` call in `initializeGame()`
- Added hint message "Tap any location to learn more" below share button on scorecard
- Styled hint message to match "FINAL SCORE" label (uppercase, same font size/color)
- Hint message hidden when scorecard is minimized

### Phase 12: Admin Portal & Location Management
- Created web-based admin interface (`admin/admin.html`) for managing daily locations
- Google Places API integration for location search and auto-fill coordinates
- Visual map preview with markers for validation
- Date selector with "Load Existing" functionality to edit existing dates
- Real-time validation (coordinates, required fields, Philadelphia bounds)
- YAML export with copy-to-clipboard functionality
- Organized admin tools into `admin/` directory:
  - `admin/admin.html` - Main admin interface (gitignored - contains API keys)
  - `admin/admin.html.example` - Template without API keys
  - `admin/setup-api-key.sh` - Script to add Google Maps API key
  - `admin/GET_API_KEY.md` - Quick guide to get API key
  - `admin/SETUP.md` - Detailed setup instructions
  - `admin/README.md` - Admin portal overview
- Created validation script (`scripts/validate-locations.js`) to check YAML file for errors
- Updated documentation with location management guide (`docs/LOCATION_MANAGEMENT.md`)
- Sticky map preview on admin interface (map stays visible while scrolling locations)

### Phase 13: Analytics Tracking
- Integrated Google Analytics 4 (GA4) for game metrics tracking
- Created `js/analytics.js` module for centralized event tracking
- Tracks daily active users (on first interaction)
- Tracks game completions with scores and date
- Tracks location guesses for difficulty analysis (location_id, distance, score)
- Tracks share button clicks
- Tracks errors for error rate monitoring
- Privacy-focused implementation (IP anonymization enabled)
- Added analytics setup documentation (`docs/ANALYTICS_SETUP.md`)
- Analytics Measurement ID is safe to commit (unlike API keys)

### Phase 14: Cache-Busting for Mobile Users
- Implemented multi-layer cache-busting to prevent stale location data on mobile browsers
- Added cache-control meta tags in HTML (`no-cache, no-store, must-revalidate`)
- Added cache-busting query parameters to locations.yaml fetch:
  - Date-based version parameter (`?v=YYYY-MM-DD`) - invalidates cache daily
  - Timestamp parameter (`&t=timestamp`) - ensures uniqueness within the day
- Added fetch options with `cache: 'no-store'` and cache-control headers
- Ensures users always see the latest daily locations, especially on mobile devices with aggressive caching
- Added comprehensive tests for cache-busting functionality

### Phase 15: Compact Location Card Layout
- Redesigned location card to be more compact and take up less screen space
- Location and running score now displayed side-by-side instead of stacked
- Added vertical divider between location and running score for visual separation
- Reduced font sizes and spacing throughout the card for better mobile experience
- Location card centered on screen (instead of right-aligned) for better visibility
- Minimized final score card remains right-aligned for consistency
- Instruction text moved to span full width of card and centered
- Updated instruction text to "Tap the location on the map" for clarity
- Significantly reduced card height, especially on mobile devices
- Running score stacks vertically (label on top, number below) to prevent overflow
- Removed text truncation from location names (critical for gameplay)

### Phase 16: Native Mobile Sharing
- Integrated Web Share API for native mobile sharing experience
- Share button now opens native share sheet on mobile devices (Messages, Email, etc.)
- Falls back to clipboard API on desktop and older browsers
- Handles user cancellation gracefully (no error shown)
- Share includes score message with emojis and game URL
- Added comprehensive tests for Web Share API functionality

### Phase 17: Game Menu & How to Play
- Added hamburger menu button in top-left corner (outside location card)
- Menu slides in from the left side (matching menu button position)
- Menu header displays "How to Play" instead of generic "Menu"
- Comprehensive "How to Play" section explaining game rules and scoring
- Location recommendations section with contact email (playphillytap@gmail.com)
- Menu can be closed via close button (×), overlay click, or menu button toggle
- Fixed menu button icon vertical centering for better visual alignment
- Menu styled with blue color scheme matching the UI
- Responsive design for mobile and desktop

## Project Structure

```
philly-tap/
├── index.html                 # Main application (root - required for GitHub Pages, now ~106 lines)
├── css/
│   └── styles.css             # All CSS styles (858 lines, extracted from index.html)
├── js/
│   ├── config.js              # Configuration constants (device detection, MAX_DISTANCE)
│   ├── utils.js               # Utility functions (distance, score, formatting, emoji)
│   ├── analytics.js           # Analytics tracking (Google Analytics 4)
│   ├── gameState.js           # Game state management (localStorage, save/load)
│   ├── locations.js           # Location loading from YAML and date management
│   ├── map.js                 # Map initialization, pin icons, marker management
│   ├── ui.js                  # UI updates (modals, displays, share, completion)
│   ├── gameLogic.js           # Core game logic (guessing, confirmation, progression)
│   └── main.js                # Initialization and event handlers setup
├── config/
│   └── locations.yaml         # Daily locations configuration (YAML format)
├── admin/                     # Admin portal for location management
│   ├── admin.html             # Admin interface (gitignored - contains API keys)
│   ├── admin.html.example     # Template without API keys
│   ├── setup-api-key.sh       # Script to add Google Maps API key
│   ├── GET_API_KEY.md         # Quick guide to get API key
│   ├── SETUP.md               # Detailed setup instructions
│   └── README.md              # Admin portal overview
├── docs/
│   ├── README.md              # User-facing documentation
│   ├── DEPLOYMENT.md          # Deployment instructions
│   ├── GITHUB_PAGES_SETUP.md  # GitHub Pages specific setup
│   ├── DEVELOPMENT.md         # Developer guide (testing, reset methods)
│   ├── TESTING.md             # Testing guidelines and workflow
│   ├── LOCATION_MANAGEMENT.md # Location management guide
│   ├── ANALYTICS_SETUP.md     # Analytics setup guide
│   ├── USAGE_TRACKING.md      # Usage tracking guide
│   └── context.md             # This file - project context and history
├── scripts/
│   ├── sync-to-github.sh      # Manual GitHub sync script
│   └── validate-locations.js  # YAML validation script
├── test/
│   ├── game-tests.js          # Comprehensive test suite (119+ tests)
│   ├── run-tests-automated.html  # Browser test runner (auto-run)
│   ├── run-tests-sync.js      # Node.js test runner (for pre-commit)
│   ├── run-tests.sh           # Automated test runner script
│   └── README.md              # Test suite documentation
├── .git/
│   └── hooks/
│       ├── pre-commit         # Runs tests before commits
│       └── post-commit        # Auto-pushes to GitHub after commits
├── .gitignore                 # Git ignore rules
└── .nojekyll                  # GitHub Pages configuration
```

## Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Code Organization**: Modular JavaScript structure (8 modules), separated CSS
- **Mapping**: Leaflet.js (open-source mapping library)
- **Map Tiles**: CartoDB Voyager NoLabels (vibrant tiles without labels)
- **Storage**: localStorage (for daily game state persistence)
- **Configuration**: YAML file for daily locations (`config/locations.yaml`)
- **YAML Parser**: js-yaml (loaded from CDN)
- **Testing**: Custom test framework (browser-based, 119+ tests)
- **Deployment**: GitHub Pages (static hosting)

## Core Features

### 1. Interactive Map
- Full-screen map of Philadelphia
- No street names or labels (clean aesthetic)
- Mobile and desktop responsive
- Touch and mouse interaction support
- Viewport resize handling for mobile browsers
- Orientation change support

### 2. Daily Location Guessing Game
- **5 Locations per day** (configurable via `config/locations.yaml`)
- **Sequential display**: Locations appear one at a time
- **Default locations**:
  1. Liberty Bell (🔔)
  2. Independence Hall (🏛️)
  3. Philadelphia Museum of Art (🎨)
  4. Reading Terminal Market (🍕)
  5. City Hall (🏢)
- **Date-based configuration**: Different locations can be set for specific dates
- **Fallback**: Uses default locations if no date-specific config exists
- **Cache-busting**: Multi-layer cache prevention ensures users always see latest locations
  - HTML meta tags prevent browser caching
  - Fetch requests include date-based version and timestamp query parameters
  - Ensures mobile users don't see stale cached location data

### 3. Sequential Game Flow with Animations
- **One location at a time**: User focuses on single location
- **Fade animations**: Smooth transitions between locations
- **Pulse animation**: Icon pulses to indicate user should tap
- **Next location overlay**: Shows upcoming location with animation
- **Progress indicator**: Shows "Location X of 5"
- **No skipping**: Ensures all locations are played in order

### 4. Scoring System
- **Base Scores**: 0-100 points per location (calculated from distance)
- **Score Multipliers**:
  - Locations 1-2 (id: 0-1): Base score only (no multiplier)
  - Location 3 (id: 2): Base score × 2 (doubled)
  - Locations 4-5 (id: 3-4): Base score × 3 (tripled)
- **Total Score Range**: 0-1000 points (sum of all 5 locations with multipliers: 100 + 100 + 200 + 300 + 300)
- **Distance-based**: Uses Haversine formula to calculate distance
- **Scoring Curve**: Exponential decay with adjusted curve to reward accuracy (closer = exponentially better score)
  - Formula: `baseScore = 100 * (1 - (distance / MAX_DISTANCE))^1.8`
  - Exponent of 1.8 balances rewarding close guesses while not being too harsh on distance
  - Close guesses (200-500ft) get high scores (99, 97)
  - Medium distances (1-2 miles) get moderate scores (67, 40)
  - Far distances (3-4 miles) get lower scores (19, 5)
  - Then multipliers are applied: `finalScore = baseScore × multiplier`
- **Maximum Distance**: 8000m (8km / ~5 miles) - beyond this = 0 points

### 5. Visual Feedback
- Blue pin (📍) at user's guess location
- Colored icon pin (🔔/🏛️/🎨/🍕/🏢) at actual location
- Dashed line connecting the two points
- Distance label at midpoint of line (in meters)
- Quick score popup on each guess
- Running total score display

### 6. Share Score Functionality
- **Share button**: On completion screen, below score table
- **Base scores in share**: Share message shows base scores (1-100 range) rather than multiplied scores
  - Makes it easier to compare performance across locations
  - Multipliers are still applied to the total score calculation
- **Highly varied emoji mapping**: 50+ unique emojis for visual variety
  - Each score value (0-100) maps to a distinct emoji
  - Examples: 🎯 (100), 👑 (98-99), ⭐ (97), 💫 (96), 🏅 (95), 🥇 (94), 🏵️ (93), 🎖️ (92), 🏆 (90-91), 💎 (89, 76), 💍 (88), ✨ (87, 78), 🌟 (86, 77), 🎉 (85), 🎊 (84), 🔥 (83), 💥 (82), ⚡ (81), 😁 (75), 😄 (74), 😊 (73), 👍 (72), 👏 (71), 🤗 (70), 🙌 (69, 65), 👋 (68), ✌️ (67), 🤞 (66), 🤝 (64), 👌 (63, 60), 🙂 (62), 😌 (61), 🤔 (58-59), 😐 (55-57, 35-37), 😑 (53-54, 38-39), 🫣 (50-52), 🤷 (48-49), 😕 (45-47, 33-34), 😶 (43-44, 40-42), 😟 (30-32, 20-22), 😞 (28-29), 😔 (25-27), 😓 (23-24), 😥 (18-19), 😢 (15-17), 😰 (13-14, 5-7), 😨 (10-12), 😱 (8-9), 😭 (3-4, 0), 💀 (1-2)
- **Share message format**:
  ```
  playphillytap.com January 17
  96⭐ 100🎯 95🏅 87💎 89💎
  Final score: 467
  ```
  Note: Scores shown are base scores (1-100), while final score uses multiplied values
- **Clipboard API**: Automatically copies to clipboard
- **Native Share API**: Falls back to clipboard if not available

### 7. Game State Management
- **Daily Persistence**: Saves progress to localStorage
- **Auto-reset**: New game each day (based on date)
- **Automatic Cleanup**: Removes old localStorage entries on page load (keeps only current day)
- **State Validation**: Validates saved guesses against current day's locations
- **Invalid Guess Filtering**: Filters out guesses for locations that don't exist in current day's set
- **Progress Tracking**: Shows which locations are completed
- **Sequential Progression**: Tracks current location index
- **Completion Detection**: Shows completion screen when all 5 locations guessed

### 8. Completion Screen
- **Score table**: Shows all locations with distances and scores
- **Final score**: Total aggregated score
- **Share button**: Allows sharing score with emojis
- **Clean UI**: Organized display of all game results

### 9. User Interface
- **Current Location Panel**: Top (mobile) / Right side (desktop)
  - Current location icon and name
  - Progress indicator (Location X of 5)
  - Running total score
- **Game Instructions**: Initial guidance for first-time users
- **Quick Score Popup**: Temporary display on each guess
- **Next Location Overlay**: Animated transition between locations

### 10. Development Features
- **Developer Mode**: `DEV_MODE` flag for testing (disables localStorage)
- **Session Reset**: Keyboard shortcut (Ctrl+Shift+R / Cmd+Shift+R)
- **Browser Console Commands**: Manual reset methods
- **Test Suite**: 65+ automated tests

## Key Functions

### Distance Calculation
```javascript
function calculateDistance(lat1, lon1, lat2, lon2)
```
- Uses Haversine formula for accurate distance between lat/lng coordinates
- Returns distance in meters
- Accounts for Earth's curvature

### Distance Formatting
```javascript
function formatDistance(meters)
```
- Converts meters to feet/miles for display
- **Conversion**: 1 meter = 3.28084 feet
- **Display rules**:
  - Less than 5280 feet (1 mile): Displays in feet (e.g., "328ft")
  - 5280 feet or more: Displays in miles with 2 decimal places (e.g., "1.50mi")
- Used in:
  - Instruction text showing guess distances
  - Completion screen results table
  - Map marker distance labels

### Score Calculation
```javascript
function calculateScore(distance, maxDistance = 8000)
function applyScoreMultiplier(score, locationId)
```
- Base Formula: `100 * (1 - (distance / maxDistance))^1.8`
- Exponential decay curve with steeper penalty for distance
- Closer guesses get disproportionately better scores
- Maximum distance: 8000 meters (8km / ~5 miles)
- **Score Multipliers** (applied after base score calculation):
  - Location 3 (id: 2): **x2 multiplier** (doubles the base score)
  - Locations 4-5 (id: 3-4): **x3 multiplier** (triples the base score)
  - Locations 1-2 (id: 0-1): No multiplier (base score only)
- Maximum possible total score: 1000 points (100 + 100 + 200 + 300 + 300)

### Share Message Generation
```javascript
function generateShareMessage()
function getScoreEmoji(score)
async function shareScore()
```
- Generates formatted share message with URL, date, scores, and emojis
- Maps scores to appropriate emojis
- Uses Clipboard API or native Share API

### Location Progression
```javascript
function getCurrentLocation()
function updateCurrentLocationDisplay(animate)
function advanceToNextLocation()
function makeGuess(tapLatLng)
```
- Manages sequential location display
- Handles animations and transitions
- Prevents skipping locations
- Updates UI and game state

### Transition Guard (Critical for Mobile)
```javascript
let isTransitioning = false;
let transitionTimeoutId = null;
let displayUpdateTimeoutId = null;
```
- **CRITICAL**: The `isTransitioning` flag MUST be set to `true` immediately after the guard check in `makeGuess()`, BEFORE the `setTimeout()` call
- Prevents location skipping during rapid taps on mobile devices
- Blocks new guesses while a transition is in progress
- Clears existing timeouts before starting new transitions to prevent overlaps
- **Regression Prevention**: Tests verify the flag is set before setTimeout to prevent this bug from recurring
- Transition duration: 500ms fade-out + 2100ms overlay = 2600ms total

### State Management & Cleanup
```javascript
function cleanupOldGameState()
function loadGameState()
function saveGameState()
function initializeGame()
```
- **`cleanupOldGameState()`**: Removes all localStorage entries that match `phillyGame_` pattern except today's entry
  - Runs automatically on every page load
  - Prevents localStorage accumulation of old game states
  - Logs cleanup actions for debugging
- **`loadGameState()`**: Loads game state from localStorage for today's date
  - Calls `cleanupOldGameState()` first to remove old entries
  - Uses date-based key: `phillyGame_${today.toDateString()}`
  - Handles JSON parsing errors gracefully
- **`saveGameState()`**: Saves current game state to localStorage
  - Uses date-based key (changes automatically each day)
  - Respects `DEV_MODE` flag (doesn't save in dev mode)
- **`initializeGame()`**: Initializes game after locations are loaded
  - Validates saved guesses against current day's locations
  - Filters out guesses for locations not in today's set
  - Recalculates totalScore based on valid guesses only
  - Resets game if no valid guesses remain
  - Restores markers for valid guesses

### Game State Structure
```javascript
{
  currentLocationIndex: number,  // Current location being guessed (0-4)
  guesses: {
    [locationId]: {
      latlng: { lat: number, lng: number },  // User's guess coordinates
      distance: number,                      // Distance in meters
      score: number                          // Score 0-100
    }
  },
  totalScore: number                         // Sum of all scores (0-1000 with multipliers)
}
```

### localStorage Key Format
- Key: `phillyGame_${today.toDateString()}`
- Example: `phillyGame_Tue Jan 17 2025`
- Value: JSON stringified gameState
- Resets automatically each day (new key for each day)

### State Cleanup & Validation

The game includes automatic state management to ensure players can play with new locations each day:

#### Automatic Cleanup (`cleanupOldGameState()`)
- **Runs on every page load** before loading game state
- Removes all localStorage entries that match the `phillyGame_` pattern but aren't for today
- Prevents localStorage from accumulating old game states
- Logs cleanup actions to console for debugging

#### State Validation (`initializeGame()`)
- **Validates saved guesses** against current day's locations when initializing the game
- Filters out guesses for location IDs that don't exist in today's location set
- Recalculates `totalScore` based only on valid guesses
- Resets `currentLocationIndex` if no valid guesses remain
- Ensures game state matches current locations (handles cases where locations change)

**How it works:**
1. On page load, `loadGameState()` calls `cleanupOldGameState()` to remove old entries
2. Game state is loaded from localStorage using today's date key
3. When `initializeGame()` runs after locations load, it validates all guesses against current locations
4. Invalid guesses are filtered out, score is recalculated, and game starts fresh if needed

This ensures that when new locations are available each day, players always start with a clean slate for that day's locations.

## Location Configuration

Locations are defined in `config/locations.yaml` file. The file supports:

1. **Default locations**: Used when no specific date match is found
2. **Date-specific locations**: Format `YYYY-MM-DD` as keys for specific dates

### Current Location Sets

The game includes location sets for:
- **Default locations**: Fallback set used when no date-specific match exists
- **January 2025**: Daily location sets for January 18-31, 2025 (14 days)
- **Current date**: Location set for today (2026-01-17)

### Difficulty Progression

Each day's locations are organized by difficulty, with `id` indicating difficulty level:

- **Location 0 (Easiest)**: Most Philadelphians should be able to identify these well-known landmarks
  - Examples: Rocky Steps, Love Park, South Street, Rittenhouse Square, Ben Franklin Bridge, Spruce Street Harbor Park
- **Location 1 (~10% accuracy)**: Well-known but more specific locations that about 10% of players get close to
  - Examples: Monk's Cafe, Bob & Barbara's, Jim's Steaks, Pat's King of Steaks, Dirty Frank's
- **Locations 2-4 (Hardest)**: Progressively more challenging locations
  - Location 2: Museums, popular attractions (Franklin Institute, Eastern State Penitentiary, Magic Gardens)
  - Location 3: Historic houses, cemeteries, specialized institutions (Powel House, Laurel Hill Cemetery, Barnes Foundation)
  - Location 4 (Hardest): Lesser-known historic sites, specialized venues, outlying areas (Wagner Free Institute, Stenton Mansion, Bartram's Garden)

### Location Types

Locations include a diverse mix of:
- **Landmarks**: Rocky Steps, Love Park, South Street, Ben Franklin Bridge, Boathouse Row
- **Bars & Restaurants**: Monk's Cafe, Bob & Barbara's, McGillin's Olde Ale House, Jim's Steaks, Pat's/Geno's
- **Parks & Outdoor Spaces**: Rittenhouse Square, Washington Square, Spruce Street Harbor Park, Wissahickon Valley
- **Museums & Cultural Sites**: Philadelphia Museum of Art, Franklin Institute, Mutter Museum, Magic Gardens, Barnes Foundation
- **Historic Buildings**: Independence Hall, Betsy Ross House, Powel House, Elfreth's Alley
- **Cemeteries**: Laurel Hill Cemetery, Woodlands Cemetery, Mt. Moriah Cemetery
- **Specialized Institutions**: Wagner Free Institute of Science, Please Touch Museum, Academy of Natural Sciences
- **Intersections & Districts**: Chinatown Gate, Market East Station, Old City District

### Uniqueness Requirement

All locations are unique across the entire configuration - no location appears twice in the same file. This ensures variety and prevents repetition.

### YAML Structure

Locations can optionally include a `description` field for educational information that appears after guessing:

```yaml
default:
  - id: 0
    name: Liberty Bell
    coordinates: [39.9496, -75.1503]
    icon: 🔔
    description: The Liberty Bell is an iconic symbol of American independence. Originally hung in the Pennsylvania State House (now Independence Hall) in 1753, the bell gained its famous crack and became a symbol of freedom and abolition.

2025-01-20:
  - id: 0
    name: South Street
    coordinates: [39.9419, -75.1536]
    icon: 🎸
  - id: 1
    name: Jim's Steaks
    coordinates: [39.9419, -75.1658]
    icon: 🥩
  - id: 2
    name: Magic Gardens
    coordinates: [39.9428, -75.1597]
    icon: 🎨
  - id: 3
    name: Woodlands Cemetery
    coordinates: [39.9486, -75.2047]
    icon: 🌳
  - id: 4
    name: 30th Street Station
    coordinates: [39.9556, -75.1819]
    icon: 🚂
```

**Description Field:**
- Optional field that provides educational information about each location
- Displayed in a transparent modal/bottom sheet when users click on guessed location pins or completion screen table rows
- Helps users learn about Philadelphia landmarks after playing

### Default Location Coordinates

All coordinates are in [latitude, longitude] format:

1. **Liberty Bell**: [39.9496, -75.1503]
2. **Independence Hall**: [39.9489, -75.1500]
3. **Philadelphia Museum of Art**: [39.9656, -75.1809]
4. **Reading Terminal Market**: [39.9531, -75.1584]
5. **City Hall**: [39.9523, -75.1636]

## Testing

### Test Suite Overview

The project includes a comprehensive test suite with **119+ tests** covering:

1. **Core Game Logic (25 tests)**
   - Distance calculations (3 tests)
   - Score calculations (8 tests)
   - Location progression (5 tests)
   - Game state management (3 tests)
   - Edge cases (5 tests)
   - Integration tests (1 test)

2. **Share Functionality (17 tests)**
   - Emoji mapping (9 tests)
   - Date formatting (1 test)
   - Message generation (7 tests)

3. **Map Rendering & Visibility (23 tests)**
   - Container existence and visibility (6 tests)
   - Configuration validation (3 tests)
   - Tile layer setup (3 tests)
   - Map instance checks (4 tests)
   - Interaction handling (3 tests)
   - Viewport handling (2 tests)
   - Style checks (2 tests)

4. **UI Features & Location Information (15 tests)**
   - Location info modal functionality (3 tests)
   - Minimize/expand functionality (1 test)
   - Score display in minimized state (2 tests)
   - Description handling (2 tests)
   - Minimized state UI elements (2 tests)
   - Minimize button visibility (5 tests)

5. **Guess Confirmation Flow (6 tests)**
   - Preview marker creation on tap (1 test)
   - Confirmation button visibility (1 test)
   - Guess processing on confirmation (1 test)
   - Preview replacement by new tap (1 test)
   - Line and location marker creation timing (1 test)
   - Edge case handling (1 test)

### Test Execution

**Automatic (Pre-commit Hook)**
- Tests run automatically before each commit
- Blocks commit if tests fail
- Uses `test/run-tests-sync.js` (Node.js)

**Manual (Browser)**
```bash
./test/run-tests.sh
```
Opens test page in browser with full DOM support.

**Direct Browser**
- Open `test/run-tests-automated.html` in browser
- Tests run automatically and display results

### Test-First Development Workflow

1. Write tests for new functionality
2. Run tests to verify they pass
3. Ensure existing tests still pass
4. Only commit if all tests pass

See `docs/TESTING.md` for detailed testing guidelines.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Requires localStorage support
- Requires Clipboard API (for share functionality)

## Development Notes

### Map Configuration
- Initial zoom: 13 (desktop), 12 (mobile)
- Center: [39.9526, -75.1652] (Philadelphia downtown)
- Min zoom: 10, Max zoom: 19
- Tile provider: CartoDB light_nolabels
- Subdomains: a, b, c, d (for load balancing)

### Touch vs Click Handling
- Distinguishes between taps and drags
- Prevents accidental guesses while panning
- Supports pinch-to-zoom on mobile
- Tap tolerance: 15 pixels

### Performance
- Single HTML file (no external dependencies except Leaflet CDN)
- Lightweight (~50KB total)
- Fast loading and rendering
- No backend required

### Animations
- **Fade in/out**: Location transitions
- **Pulse**: Icon animation to indicate tapping
- **Quick score**: Popup animation on guess
- **Next location overlay**: Full-screen transition animation

### Session Management
- **Daily Reset**: New game each day automatically
- **Developer Mode**: `DEV_MODE` flag to disable persistence
- **Reset Shortcut**: Ctrl+Shift+R / Cmd+Shift+R
- **Browser Console**: Manual reset commands

See `docs/DEVELOPMENT.md` for detailed development guide.

## Deployment

**Live Site**: https://playphillytap.com

**Platform**: GitHub Pages (static hosting)

### Auto-Sync Setup

1. **Post-commit hook**: Automatically pushes after each `git commit`
2. **Pre-commit hook**: Runs tests before allowing commit
3. **Manual sync script**: Run `./scripts/sync-to-github.sh` anytime

See `docs/DEPLOYMENT.md` and `docs/GITHUB_PAGES_SETUP.md` for detailed deployment instructions.

## Maintenance

### Updating Locations
Edit `config/locations.yaml` file:

1. **Update default locations**: Modify the `default:` section
2. **Add date-specific locations**: Add a new date key (YYYY-MM-DD format)

**Difficulty Guidelines:**
- **Location 0 (id: 0)**: Should be easily identifiable by most Philadelphians (major landmarks, popular spots)
- **Location 1 (id: 1)**: Well-known but more specific (~10% of players should get close)
- **Locations 2-4 (id: 2-4)**: Progressively harder (museums, historic sites, specialized venues, outlying areas)

**Requirements:**
- All locations must be unique (no duplicates within the file)
- Each day should have 5 locations (id 0-4)
- Locations should progress from easiest (0) to hardest (4)
- Mix of location types: landmarks, bars, restaurants, parks, museums, historic sites

Example:
```yaml
2025-01-20:
  - id: 0
    name: South Street
    coordinates: [39.9419, -75.1536]
    icon: 🎸
  - id: 1
    name: Jim's Steaks
    coordinates: [39.9419, -75.1658]
    icon: 🥩
  - id: 2
    name: Magic Gardens
    coordinates: [39.9428, -75.1597]
    icon: 🎨
  - id: 3
    name: Woodlands Cemetery
    coordinates: [39.9486, -75.2047]
    icon: 🌳
  - id: 4
    name: 30th Street Station
    coordinates: [39.9556, -75.1819]
    icon: 🚂
```

The app automatically loads the correct locations based on today's date.

### Location Information & UI Features

**Location Descriptions:**
- Add optional `description` field to locations in YAML for educational content
- Descriptions appear in a transparent modal/bottom sheet after guessing
- Accessible by clicking guessed location pins on the map or table rows in completion screen
- Modal is easily dismissible (click X button or outside modal)

**Minimized Scorecard:**
- Scorecard starts minimized in top-right corner showing only the score
- Click "+" button to expand and see full details
- Click "−" button to minimize again
- When minimized after completion, shows "Final Score" label, score value, and share button
- Transparent background keeps map as focal point

**Transparent UI:**
- All UI elements (scorecard, modals) use transparent backgrounds with blur effect
- Map remains the center of attention
- Reduced visual clutter for better gameplay experience

**Guess Confirmation Flow:**
- When user taps map, a blue preview pin appears immediately at the tap location
- Green confirmation button appears at bottom center with checkmark icon
- User can tap elsewhere to change guess (preview pin moves to new location)
- Only after clicking "Confirm Guess" button:
  - Line connecting guess to actual location is drawn
  - Red location marker appears at actual location
  - Distance label shows between the two points
  - Score is calculated and game advances to next location
- Provides better control over guess placement before finalizing

### Changing Scoring
Modify `MAX_DISTANCE` (default: 8000 meters) and `calculateScore()` function in `js/utils.js`.
To change multipliers, update the `applyScoreMultiplier()` logic in `makeGuess()` function in `js/gameLogic.js`.

### Preventing Regressions

#### Mobile Transition Bug (Location Skipping)
**Problem**: Locations 2 and 4 (indices 1 and 3) were being skipped during rapid taps on mobile.

**Root Cause**: The `isTransitioning` flag was not set to `true` before the `setTimeout()` call, allowing multiple simultaneous transitions.

**Fix**: 
1. Set `isTransitioning = true` immediately after the guard check
2. Clear existing timeouts before starting new transitions
3. Properly manage timeout IDs for cleanup

**Prevention**:
- Tests verify the flag is set BEFORE setTimeout (see `Transition guard: isTransitioning must be set BEFORE setTimeout` test)
- Tests verify rapid fire calls are blocked (see `Transition guard: rapid fire calls should only process first` test)
- Tests verify timeout clearing prevents overlaps (see `Transition guard: timeout clearing prevents overlapping transitions` test)
- **CRITICAL**: When modifying `makeGuess()` or `advanceToNextLocation()`, ensure `isTransitioning = true` is set immediately after the guard check, before any async operations

**Test Coverage**: 5+ tests specifically target this bug to prevent regression.

### Styling
All CSS is embedded in `<style>` tag in `index.html`.

## Git Workflow

- **Main branch**: `main`
- **Auto-sync**: Post-commit hook pushes to GitHub
- **Test enforcement**: Pre-commit hook runs tests before commit
- **Manual sync**: Run `./scripts/sync-to-github.sh`

## Key Bug Fixes & Improvements

### Location Skipping Bug
- **Issue**: Locations 2 and 4 were being skipped during sequential display
- **Root Cause**: Variable name conflict and incorrect index management
- **Fix**: Used temporary `nextIndex` variable and proper loop logic
- **Result**: All locations now display sequentially without skipping

### Share Button Not Working
- **Issue**: Share button did nothing when clicked
- **Root Cause**: JavaScript functions (`getScoreEmoji`, `generateShareMessage`, `shareScore`) were missing
- **Fix**: Added all three functions to implement share functionality
- **Result**: Share button now copies formatted message to clipboard

### Map Container Test Failing
- **Issue**: Test failed on test page (no map container present)
- **Root Cause**: Test asserted map exists without checking if container is present
- **Fix**: Added graceful skip when container doesn't exist
- **Result**: Test skips appropriately in different environments

## Future Enhancement Ideas

- [x] Sequential location display
- [x] Share score functionality
- [x] Comprehensive test suite
- [x] Pre-commit test automation
- [ ] Rotate locations daily (different set each day)
- [ ] Leaderboard (requires backend)
- [ ] More locations (expand beyond 5)
- [ ] Difficulty levels
- [ ] Hint system
- [ ] Historical accuracy tracking
- [ ] Social features

## Last Updated

**Generated**: 2026-01-17  
**Last Updated**: 2026-01-19 - Scoring system improvements  
**Last commit**: Check `git log` for latest changes

**Recent Updates:**
- **Location Info Modal Photo Support (2026-01-25)**: Added photo display to location info modal
  - Photos now appear in both location card and location info modal (description popup)
  - Tap-to-zoom functionality works from both locations
  - Photo displays above description text in modal
  - Responsive sizing for mobile devices
  - Added 6 new tests for location info modal photo functionality
- **Scoring Adjustments (2026-01-25)**: Updated scoring exponent to 1.8 for balanced scoring
  - Adjusted scoring exponent from 2.3 to 1.8 for more balanced curve
  - Balances rewarding close guesses while not being too harsh on distance
  - MAX_DISTANCE remains 8000m (8km / ~5 miles) to avoid more zero scores
  - Score examples: 200ft = 99, 500ft = 97, 1 mile = 67, 2 miles = 40, 3 miles = 19, 4 miles = 5
- **Scoring Improvements (2026-01-25)**: Updated scoring system to reward accuracy more
  - Increased scoring exponent from 2.0 to 2.3 for steeper curve
  - Steeper curve penalizes distance more while keeping close guesses high
  - MAX_DISTANCE remains 8000m (8km / ~5 miles) to avoid more zero scores
  - Score examples: 200ft = 98, 500ft = 96, 1 mile = 60, 2 miles = 31, 3 miles = 12, 4 miles = 2
- **Scoring Improvements (2026-01-19)**: Updated scoring system to reduce zero scores
  - Increased MAX_DISTANCE from 5000m to 8000m (~5 miles)
  - Increased scoring exponent from 1.2 to 2.0 for steeper curve
  - Quick score popup now shows base score before multipliers
- **Analytics Tracking (2026-01-19)**: Integrated Google Analytics 4 for game metrics
  - Added `js/analytics.js` module for centralized event tracking
  - Tracks daily active users, game completions, location difficulty, share clicks, and errors
  - Privacy-focused implementation with IP anonymization
  - Analytics Measurement ID safe to commit (unlike API keys)
  - Setup documentation in `docs/ANALYTICS_SETUP.md`
- **Admin Portal (2026-01-19)**: Created web-based admin interface for location management
  - Web interface (`admin/admin.html`) with Google Places API integration
  - Location search and auto-fill coordinates
  - Visual map preview with sticky layout
  - YAML export with copy-to-clipboard
  - Load existing dates from `config/locations.yaml`
  - Validation script (`scripts/validate-locations.js`) for YAML file
  - Admin files organized in `admin/` directory
  - Setup documentation and scripts included
- **UI Improvements (2026-01-18)**: Added hint message to scorecard and adjusted location card sizing
  - Added "Tap any location to learn more" hint below share button on scorecard
  - Styled hint to match "FINAL SCORE" label styling (uppercase, same font)
  - Adjusted location card sizing: smaller emoji (32px), larger progress/multiplier text
- **Multiplier Visibility (2026-01-18)**: Added multiplier indicators to help users understand scoring
  - Multiplier shown under "Location X of 5" progress indicator during gameplay
  - Final scorecard displays "baseScore × multiplier = finalScore" format for clarity
  - Fixed game state persistence issue by ensuring `loadGameState()` is called on initialization
- **Code Refactoring (2026-01-17)**: Organized codebase into modular structure
  - Extracted CSS to `css/styles.css` (858 lines)
  - Split JavaScript into 8 logical modules in `js/` directory
  - Reduced `index.html` from 2,423 lines to ~106 lines
  - Maintained all functionality while improving maintainability
  - Fixed `formatDistance` threshold issue (uses `meters < 1609` for accurate mile conversion)
- Added location sets for January 18-31, 2025 (14 days)
- Added location set for 2026-01-17
- Implemented difficulty progression system (id 0 = easiest, id 4 = hardest)
- Locations include diverse mix of landmarks, bars, restaurants, parks, museums, and historic sites
- All locations are unique with no duplicates
- **Comprehensive coordinate verification (2026-01-17)**: Verified and corrected GPS coordinates for all 80+ locations across all date sets to ensure pinpoint accuracy
  - Fixed 26+ coordinate errors including major corrections for Laurel Hill Cemetery, Ishkabibble's, Standard Tap, and others
  - All coordinates verified against multiple authoritative sources to ensure exact map placement

---

## Photo Support Feature (2026-01-24)

**Overview**: Added support for displaying location photos in the game, replacing icon/name when a photo is available.

**YAML Structure**: 
```yaml
2026-01-24:
  - id: 0
    photo: https://example.com/photo.jpg    # Optional photo URL
    name: Liberty Bell
    coordinates: [39.9496, -75.1503]
    icon: 🔔
    description: Optional description
```

**Features Implemented**:
- **Photo Display**: When a location has a `photo` field, it displays in the location card instead of icon/name
- **Location Info Modal Photo**: Photos also appear in the location info modal (description popup) when available
- **Responsive Sizing**: Photo container 120px × 100px (desktop), 100px × 80px (mobile) in location card
- **Modal Photo Sizing**: Photo in info modal is 200px × 150px (desktop), full-width × 120px (mobile)
- **Tap to Enlarge**: Tap photo opens full-screen modal viewer (works from both location card and info modal)
- **Close Modal**: Tap the enlarged photo again or tap outside to minimize
- **Visual Hints**: "Tap to zoom" label below photo, "Tap photo to minimize" text at bottom of modal
- **Fallback to Icon/Name**: If photo URL fails to load, automatically shows icon/name instead
- **Smooth Animations**: Fade-in animation for modal, hover zoom effect on photo
- **Admin Support**: Admin console updated with photo URL input field and parsing

**UI/UX Improvements**:
- Photo card displays in same location as icon/name (left side of card)
- Running total remains on right side with vertical divider
- Photo has hover effect (slight zoom) to indicate interactivity
- Full-screen modal with dark background (rgba(0,0,0,0.9)) for focus
- "Tap photo to minimize" hint appears at bottom of enlarged photo

**Files Modified**:
- `index.html`: Added photo container HTML and modal structure, added photo container to location info modal
- `css/styles.css`: Added 95+ lines for photo styling, modal, and animations, added location info modal photo styles
- `js/ui.js`: Added `openPhotoModal()` and `closePhotoModal()` functions, `openPhotoModalFromInfo()` for info modal, updated `updateCurrentLocationDisplay()` and `showLocationInfo()`
- `js/main.js`: Exposed photo modal functions globally
- `admin/admin.html`: Added photo URL input field, updated YAML export logic, parse photo from existing locations
- `test/game-tests.js`: Added 10+ tests for photo functionality including location info modal

**Tests Added**:
- Photo display: location with photo displays photo instead of icon
- Photo display: location without photo uses icon
- Photo modal: modal toggles correctly on tap
- Photo YAML export: photo field included in export
- Photo fallback: broken photo fails over to icon
- Location info photo: photo container visible when location has photo
- Location info photo: photo container hidden when location has no photo
- Location info photo: photo has correct source URL
- Location info photo: openPhotoModalFromInfo opens photo modal
- Location info photo: handles photo load error gracefully

---

## Mobile Transition Race Condition Fix (2026-01-24)

**Issue**: Rapid mobile taps could cause locations to be skipped due to a race condition in the transition guard.

**Root Cause**: The `isTransitioning` flag was set AFTER processing the guess, allowing multiple rapid taps to pass the guard check before the flag was set.

**Fix Implemented**:
- Moved `isTransitioning = true` to the START of `makeGuess()` function (before processing)
- This prevents race conditions where rapid taps could both pass the guard check
- Added proper flag reset in early return cases (no location, already guessed)
- Updated all mobile transition tests to properly handle async transitions

**Code Changes**:
- `js/gameLogic.js`: Set `isTransitioning = true` immediately at function start (line 86)
- Removed duplicate flag setting later in the function
- Added flag reset in early return paths

**Tests Fixed**:
- Fixed 6 mobile transition tests to properly wait for async transitions
- Tests now process locations sequentially, waiting for each transition to complete
- Added `querySelector` to Node.js mock DOM to fix UI layout test
- All 143 tests now passing (was 142/143)

**Impact**: Prevents location skipping on mobile devices when users tap rapidly, ensuring all 5 locations are always visited in order.

---

## Development Philosophy

This project follows a **test-first development** approach:
- All new features include tests
- Tests run automatically before commits
- Commits are blocked if tests fail
- Comprehensive test coverage ensures reliability

See `docs/TESTING.md` for testing guidelines and `docs/DEVELOPMENT.md` for development practices.
