# Philly Tap 🗺️

A daily location-guessing game for Philadelphia landmarks. Test your knowledge of Philly by finding 5 different locations each day!

## 🎮 How to Play

1. Select a location from the panel
2. Tap on the map where you think it is
3. See your score (0-100) based on how close you are
4. Complete all 5 locations to get your total score (0-500)

## 🌐 Live Site

**Play now:** [https://briengleason.github.io/philly-tap/](https://briengleason.github.io/philly-tap/)

## 🚀 Quick Start (Local)

Open `index.html` in a web browser to view the interactive map.

Or run a local server:
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 Project Structure

```
philly-tap/
├── index.html              # Main application (root - required for GitHub Pages)
├── config/
│   └── locations.yaml      # Daily locations configuration
├── docs/
│   ├── README.md           # This file
│   ├── DEPLOYMENT.md       # Deployment instructions
│   ├── GITHUB_PAGES_SETUP.md  # GitHub Pages setup guide
│   └── context.md          # Project documentation
└── scripts/
    └── sync-to-github.sh   # Auto-sync script
```

## 🛠️ Development

See `docs/context.md` for detailed project documentation and `docs/DEPLOYMENT.md` for deployment options.
