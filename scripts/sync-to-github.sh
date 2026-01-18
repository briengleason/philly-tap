#!/bin/bash

# Auto-sync script for Philly Tap
# This script commits any changes and pushes to GitHub

set -e

echo "🔄 Syncing to GitHub..."

# Get the script directory and navigate to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$REPO_ROOT"

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Run 'git init' first."
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin &>/dev/null; then
    echo "⚠️  No GitHub remote configured."
    echo "   Run: git remote add origin https://github.com/YOUR_USERNAME/philly-tap.git"
    exit 1
fi

# Update context.md with current date
if [ -f docs/context.md ]; then
    # Update the "Last Updated" section
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/Generated:.*/Generated: $(date)/" docs/context.md
    else
        # Linux
        sed -i "s/Generated:.*/Generated: $(date)/" docs/context.md
    fi
fi

# Stage all changes
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit. Repository is up to date."
else
    # Commit changes
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG" || {
        echo "⚠️  Commit failed. Continuing with push..."
    }
    
    # Get current branch name (compatible with older git versions)
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push origin "$BRANCH" || {
        echo "❌ Push failed. Make sure you have push access."
        exit 1
    }
    
    echo "✅ Successfully synced to GitHub!"
fi

echo "✨ Done!"
