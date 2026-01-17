# Deployment Guide

This is a static website that can be deployed to various free hosting platforms. Here are the easiest options:

## Option 1: GitHub Pages (Recommended - Free & Easy)

### Prerequisites
- GitHub account
- Git installed

### Steps

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name it (e.g., `philly-fingered`)
   - Make it public (required for free GitHub Pages)
   - Don't initialize with README (you already have files)

2. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/philly-fingered.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch and **/ (root)** folder
   - Click **Save**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/philly-fingered/`

**Pros:** Free, easy, automatic HTTPS, custom domain support
**Cons:** Repository must be public for free tier

---

## Option 2: Netlify (Free & Very Easy)

### Steps

1. **Push to GitHub first** (follow Option 1, steps 1-2)

2. **Deploy to Netlify:**
   - Go to https://app.netlify.com
   - Sign up/login with GitHub
   - Click **Add new site** → **Import an existing project**
   - Select your GitHub repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `/` (root)
   - Click **Deploy site**
   - Your site will be available at: `https://random-name-123.netlify.app`

3. **Customize domain (optional):**
   - Go to **Site settings** → **Domain management**
   - Click **Add custom domain**

**Pros:** Free, automatic HTTPS, custom domain, continuous deployment
**Cons:** None really!

---

## Option 3: Vercel (Free & Very Easy)

### Steps

1. **Push to GitHub first** (follow Option 1, steps 1-2)

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click **Add New Project**
   - Import your GitHub repository
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Click **Deploy**
   - Your site will be available at: `https://philly-fingered.vercel.app`

**Pros:** Free, automatic HTTPS, custom domain, fast CDN
**Cons:** None really!

---

## Option 4: Cloudflare Pages (Free)

### Steps

1. **Push to GitHub first** (follow Option 1, steps 1-2)

2. **Deploy to Cloudflare Pages:**
   - Go to https://dash.cloudflare.com
   - Sign up/login
   - Go to **Pages** → **Create a project**
   - Connect your GitHub account
   - Select your repository
   - Build settings:
     - Framework preset: **None**
     - Build command: (leave empty)
     - Build output directory: `/`
   - Click **Save and Deploy**
   - Your site will be available at: `https://philly-fingered.pages.dev`

**Pros:** Free, fast CDN, automatic HTTPS
**Cons:** None really!

---

## Quick Start (GitHub Pages)

If you want the fastest deployment:

```bash
# 1. Create repo on GitHub (via web interface)
# 2. Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/philly-fingered.git
git branch -M main
git push -u origin main

# 3. Enable GitHub Pages in repo settings
# 4. Your site will be live in ~1 minute!
```

---

## Custom Domain (Optional)

All platforms support custom domains:

1. **Buy a domain** (e.g., from Namecheap, Google Domains, etc.)
2. **Add DNS records** as instructed by your hosting platform
3. **Configure custom domain** in platform settings

---

## Which Should You Choose?

- **GitHub Pages**: Best if you want everything in one place (code + hosting)
- **Netlify**: Best for automatic deployments and easy custom domains
- **Vercel**: Best for performance and developer experience
- **Cloudflare Pages**: Best for global CDN performance

All are free and work great for static sites!
