# Philly Tap 🗺️

A daily location-guessing game for Philadelphia landmarks.

## 🌐 Play Now

**[https://briengleason.github.io/philly-tap/](https://briengleason.github.io/philly-tap/)**

## 📚 Documentation

- **[Full README](docs/README.md)** - Complete documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - How to deploy
- **[GitHub Pages Setup](docs/GITHUB_PAGES_SETUP.md)** - GitHub Pages instructions
- **[Project Context](docs/context.md)** - Technical documentation
- **[Location Management](docs/LOCATION_MANAGEMENT.md)** - Managing daily locations
- **[Analytics Setup](docs/ANALYTICS_SETUP.md)** - Setting up Google Analytics

## 🚀 Quick Start

```bash
# Run locally
python3 -m http.server 8000
# Visit http://localhost:8000
```

## 📁 Project Structure

```
philly-tap/
├── index.html              # Main application
├── config/
│   └── locations.yaml      # Daily locations
├── admin/                  # Admin portal (location management)
│   ├── admin.html          # Admin interface (gitignored - contains API keys)
│   ├── setup-api-key.sh    # API key setup script
│   ├── GET_API_KEY.md      # API key guide
│   └── SETUP.md            # Admin setup instructions
├── css/
│   └── styles.css          # Application styles
├── js/                     # JavaScript modules
│   ├── config.js           # Configuration
│   ├── utils.js            # Utility functions
│   ├── gameState.js        # Game state management
│   ├── locations.js        # Location loading
│   ├── map.js              # Map initialization
│   ├── ui.js               # UI updates
│   ├── gameLogic.js        # Core game logic
│   ├── analytics.js        # Analytics tracking
│   └── main.js             # Initialization
├── docs/                   # Documentation
└── scripts/                # Utility scripts
    └── validate-locations.js  # YAML validation
```

See [docs/README.md](docs/README.md) for more details.
