# Project Context: Philly Tap

## Overview

**Philly Tap** is a daily location-guessing game for Philadelphia landmarks. Users must identify 5 different locations each day by tapping on an interactive map, receiving scores based on proximity to the actual locations. The game features sequential location display with smooth animations, shareable score results, and comprehensive test coverage.

**Live Site**: https://briengleason.github.io/philly-tap/

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
- Generated formatted share messages: `briengleason.github.io/philly-tap/ January 17 96🏅 100🎯...`

### Phase 6: Testing & Quality Assurance
- Built comprehensive test suite (70+ tests)
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

## Project Structure

```
philly-tap/
├── index.html                 # Main application (root - required for GitHub Pages)
├── config/
│   └── locations.yaml         # Daily locations configuration (YAML format)
├── docs/
│   ├── README.md              # User-facing documentation
│   ├── DEPLOYMENT.md          # Deployment instructions
│   ├── GITHUB_PAGES_SETUP.md  # GitHub Pages specific setup
│   ├── DEVELOPMENT.md         # Developer guide (testing, reset methods)
│   ├── TESTING.md             # Testing guidelines and workflow
│   └── context.md             # This file - project context and history
├── scripts/
│   └── sync-to-github.sh      # Manual GitHub sync script
├── test/
│   ├── game-tests.js          # Comprehensive test suite (65+ tests)
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
- **Mapping**: Leaflet.js (open-source mapping library)
- **Map Tiles**: CartoDB light_nolabels (no street names/labels)
- **Storage**: localStorage (for daily game state persistence)
- **Configuration**: YAML file for daily locations (`config/locations.yaml`)
- **YAML Parser**: js-yaml (loaded from CDN)
- **Testing**: Custom test framework (browser-based)
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
- **Scoring Curve**: Exponential decay (closer = exponentially better score)
  - Formula: `baseScore = 100 * (1 - (distance / MAX_DISTANCE))^1.5`
  - Then multipliers are applied: `finalScore = baseScore × multiplier`
- **Maximum Distance**: 5km (beyond this = 0 points)

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
  briengleason.github.io/philly-tap/ January 17
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
function calculateScore(distance, maxDistance = 5000)
function applyScoreMultiplier(score, locationId)
```
- Base Formula: `100 * (1 - (distance / maxDistance))^1.5`
- Exponential decay curve
- Closer guesses get disproportionately better scores
- Maximum distance: 5000 meters (5km)
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

The project includes a comprehensive test suite with **80+ tests** covering:

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

**Live Site**: https://briengleason.github.io/philly-tap/

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

### Changing Scoring
Modify `MAX_DISTANCE` (default: 5000 meters) and `calculateScore()` function in `index.html`.
To change multipliers, update the `applyScoreMultiplier()` logic in `makeGuess()` function.

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
**Last Updated**: 2026-01-17 - Comprehensive coordinate verification and correction  
**Last commit**: Check `git log` for latest changes

**Recent Updates:**
- Added location sets for January 18-31, 2025 (14 days)
- Added location set for 2026-01-17
- Implemented difficulty progression system (id 0 = easiest, id 4 = hardest)
- Locations include diverse mix of landmarks, bars, restaurants, parks, museums, and historic sites
- All locations are unique with no duplicates
- **Comprehensive coordinate verification (2026-01-17)**: Verified and corrected GPS coordinates for all 80+ locations across all date sets to ensure pinpoint accuracy
  - Fixed 26+ coordinate errors including major corrections for Laurel Hill Cemetery, Ishkabibble's, Standard Tap, and others
  - All coordinates verified against multiple authoritative sources to ensure exact map placement

---

## Development Philosophy

This project follows a **test-first development** approach:
- All new features include tests
- Tests run automatically before commits
- Commits are blocked if tests fail
- Comprehensive test coverage ensures reliability

See `docs/TESTING.md` for testing guidelines and `docs/DEVELOPMENT.md` for development practices.
