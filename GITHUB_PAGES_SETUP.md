# GitHub Pages Setup Guide

Your repository is already connected to GitHub! Follow these steps to enable GitHub Pages:

## ✅ Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/briengleason/philly-fingered
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **Save**

## ✅ Step 2: Wait for Deployment

- GitHub Pages will build and deploy your site (usually takes 1-2 minutes)
- You'll see a green checkmark when it's ready
- Your site will be available at: **https://briengleason.github.io/philly-fingered/**

## ✅ Step 3: Verify It Works

1. Visit: https://briengleason.github.io/philly-fingered/
2. You should see the interactive map
3. Try selecting a location and tapping on the map!

## 🔧 Configuration Files

The following files are already set up:

- ✅ `.nojekyll` - Ensures GitHub Pages serves all files correctly
- ✅ `index.html` - Main application file
- ✅ `locations.yaml` - Location configuration
- ✅ Repository is on `main` branch

## 🎯 Custom Domain (Optional)

If you want to use a custom domain:

1. In GitHub Pages settings, add your custom domain
2. Update your DNS records as instructed
3. GitHub will automatically set up HTTPS

## 📝 Notes

- Changes pushed to `main` branch will automatically update the site
- It may take a few minutes for changes to appear
- The site uses static files only (no server-side code needed)

## 🐛 Troubleshooting

**Site not loading?**
- Check that GitHub Pages is enabled in Settings → Pages
- Verify the branch is set to `main` and folder is `/ (root)`
- Wait a few minutes for initial deployment

**Changes not showing?**
- Clear your browser cache
- Wait 1-2 minutes for GitHub Pages to rebuild
- Check the Actions tab for build status

**YAML file not loading?**
- Ensure `locations.yaml` is in the root directory
- Check browser console for errors
- Verify the file is committed to the repository

---

**Your site URL:** https://briengleason.github.io/philly-fingered/
