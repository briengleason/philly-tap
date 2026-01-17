# Project Context: Philly Fingered

## Overview

**Philly Fingered** is a daily location-guessing game for Philadelphia landmarks. Users must identify 5 different locations each day by tapping on an interactive map, receiving scores based on proximity to the actual locations.

## Project Structure

```
philly-fingered/
├── index.html          # Main application (single-page app)
├── locations.yaml      # Daily locations configuration
├── README.md           # User-facing documentation
├── DEPLOYMENT.md       # Deployment instructions
├── context.md          # This file - project context
├── .gitignore         # Git ignore rules
└── sync-to-github.sh   # Auto-sync script
```

## Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Mapping**: Leaflet.js (open-source mapping library)
- **Map Tiles**: CartoDB light_nolabels (no street names/labels)
- **Storage**: localStorage (for daily game state persistence)
- **Configuration**: YAML file for daily locations (`locations.yaml`)
- **YAML Parser**: js-yaml (loaded from CDN)
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel, etc.)

## Core Features

### 1. Interactive Map
- Full-screen map of Philadelphia
- No street names or labels (clean aesthetic)
- Mobile and desktop responsive
- Touch and mouse interaction support

### 2. Daily Location Guessing Game
- **5 Locations per day** (configurable via `locations.yaml`)
- **Default locations**:
  1. Liberty Bell (🔔)
  2. Independence Hall (🏛️)
  3. Philadelphia Museum of Art (🎨)
  4. Reading Terminal Market (🍕)
  5. City Hall (🏢)
- **Date-based configuration**: Different locations can be set for specific dates
- **Fallback**: Uses default locations if no date-specific config exists

### 3. Scoring System
- **Individual Scores**: 0-100 points per location
- **Total Score**: 0-500 points (sum of all 5 locations)
- **Distance-based**: Uses Haversine formula to calculate distance
- **Scoring Curve**: Exponential decay (closer = exponentially better score)
- **Maximum Distance**: 5km (beyond this = 0 points)

### 4. Visual Feedback
- Blue pin (📍) at user's guess location
- Red pin (🔔/🏛️/🎨/🍕/🏢) at actual location
- Dashed line connecting the two points
- Distance label at midpoint of line
- Quick score popup on each guess

### 5. Game State Management
- **Daily Persistence**: Saves progress to localStorage
- **Auto-reset**: New game each day (based on date)
- **Progress Tracking**: Shows which locations are completed
- **Location Selection**: Click location in panel to select, then tap map

### 6. User Interface
- **Score Panel**: Right side (desktop) / top (mobile)
  - Total score display
  - List of 5 locations with status
  - Individual scores for completed locations
- **Quick Score Popup**: Temporary display on each guess
- **Location Status**:
  - Unselected: Gray, clickable
  - Active: Blue highlight, "Tap on map to guess"
  - Completed: Green highlight, shows distance

## Key Functions

### Distance Calculation
- Uses Haversine formula for accurate distance between lat/lng coordinates
- Returns distance in meters
- Accounts for Earth's curvature

### Score Calculation
```javascript
score = 100 * (1 - (distance / MAX_DISTANCE))^1.5
```
- Exponential decay curve
- Closer guesses get disproportionately better scores
- Maximum distance: 5000 meters

### Game State Structure
```javascript
{
  currentLocation: null | number,  // Currently selected location ID
  guesses: {
    [locationId]: {
      latlng: { lat, lng },        // User's guess coordinates
      distance: number,            // Distance in meters
      score: number                // Score 0-100
    }
  },
  totalScore: number               // Sum of all scores
}
```

### localStorage Key Format
- Key: `phillyGame_${today}`
- Value: JSON stringified gameState
- Resets automatically each day

## Location Configuration

Locations are defined in `locations.yaml` file. The file supports:

1. **Default locations**: Used when no specific date match is found
2. **Date-specific locations**: Format `YYYY-MM-DD` as keys for specific dates

### YAML Structure

```yaml
default:
  - id: 0
    name: Location Name
    coordinates: [lat, lng]
    icon: 🔔

2025-01-20:
  - id: 0
    name: Different Location
    coordinates: [lat, lng]
    icon: 🏛️
```

### Default Location Coordinates

All coordinates are in [latitude, longitude] format:

1. **Liberty Bell**: [39.9496, -75.1503]
2. **Independence Hall**: [39.9489, -75.1500]
3. **Philadelphia Museum of Art**: [39.9656, -75.1809]
4. **Reading Terminal Market**: [39.9531, -75.1584]
5. **City Hall**: [39.9523, -75.1636]

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Requires localStorage support

## Development Notes

### Map Configuration
- Initial zoom: 13 (desktop), 12 (mobile)
- Center: [39.9526, -75.1652] (Philadelphia downtown)
- Min zoom: 10, Max zoom: 19
- Tile provider: CartoDB light_nolabels

### Touch vs Click Handling
- Distinguishes between taps and drags
- Prevents accidental guesses while panning
- Supports pinch-to-zoom on mobile

### Performance
- Single HTML file (no external dependencies except Leaflet CDN)
- Lightweight (~50KB total)
- Fast loading and rendering
- No backend required

## Future Enhancement Ideas

- [ ] Rotate locations daily (different set each day)
- [ ] Leaderboard (requires backend)
- [ ] Share score functionality
- [ ] More locations (expand beyond 5)
- [ ] Difficulty levels
- [ ] Hint system
- [ ] Historical accuracy tracking
- [ ] Social features

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

**Recommended Platforms:**
- GitHub Pages (free, easy)
- Netlify (free, automatic deployments)
- Vercel (free, fast CDN)
- Cloudflare Pages (free, global CDN)

## Maintenance

### Updating Locations
Edit `locations.yaml` file:

1. **Update default locations**: Modify the `default:` section
2. **Add date-specific locations**: Add a new date key (YYYY-MM-DD format)
3. **Location format**:
   ```yaml
   - id: 0
     name: Location Name
     coordinates: [latitude, longitude]
     icon: 🔔
   ```

Example:
```yaml
default:
  - id: 0
    name: Liberty Bell
    coordinates: [39.9496, -75.1503]
    icon: 🔔

2025-01-20:
  - id: 0
    name: Philadelphia Museum of Art
    coordinates: [39.9656, -75.1809]
    icon: 🎨
```

The app automatically loads the correct locations based on today's date.

### Changing Scoring
Modify `MAX_DISTANCE` and `calculateScore()` function in `index.html`.

### Styling
All CSS is embedded in `<style>` tag in `index.html`.

## Git Workflow

- Main branch: `main` (or `master`)
- Auto-sync: Post-commit hook pushes to GitHub
- Manual sync: Run `./sync-to-github.sh`

## Last Updated

Generated: 2025-01-17
Last commit: Check `git log` for latest changes

---

## Auto-Sync Setup

This project includes automatic GitHub syncing:

1. **Post-commit hook**: Automatically pushes after each `git commit`
2. **Manual sync script**: Run `./sync-to-github.sh` anytime

### Setup Instructions

1. **Add GitHub remote** (if not already done):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/philly-fingered.git
   ```

2. **Test the sync**:
   ```bash
   ./sync-to-github.sh
   ```

3. **Automatic syncing**: Every `git commit` will now auto-push to GitHub!

### Manual Sync

Run anytime:
```bash
./sync-to-github.sh
```

This will:
- Update `context.md` timestamp
- Stage all changes
- Commit with timestamp
- Push to GitHub
