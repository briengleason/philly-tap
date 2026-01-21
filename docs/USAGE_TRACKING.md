# Usage Tracking Guide

This guide covers different ways to track usage for Philly Tap, including Google Maps API usage and game analytics.

## 1. Google Maps API Usage Tracking

### Monitor in Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **View API Usage:**
   - Go to **"APIs & Services"** → **"Dashboard"**
   - See overview of all API usage
   - Go to **"APIs & Services"** → **"Quotas"** for detailed limits

3. **Set Up Billing Alerts:**
   - Go to **"Billing"** → **"Budgets & alerts"**
   - Create a budget alert to notify you when usage exceeds thresholds
   - Set alerts at 50%, 90%, and 100% of free tier ($200/month)

4. **API-Specific Usage:**
   - **Maps JavaScript API**: View map loads, requests
   - **Places API**: View text searches, autocomplete requests
   - Each API shows requests per day/hour

### Free Tier Limits

- **$200 free credit per month**
- **Maps JavaScript API**: ~28,000 map loads
- **Places API (Text Search)**: ~17,000 searches
- **Places API (Autocomplete)**: ~17,000 requests

### Cost Estimation

For personal/admin use, you're unlikely to exceed free tier. Typical usage:
- Admin portal: ~10-50 searches per day = ~1,500/month (well under limit)
- Game map loads: Depends on users, but static map tiles are free

## 2. Game Analytics

### Option A: Google Analytics 4 (Recommended)

**Pros:**
- Free
- Comprehensive tracking
- Privacy-compliant
- Easy to set up

**Setup:**

1. Create a Google Analytics 4 property at https://analytics.google.com/
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Track Custom Events:**

```javascript
// Track game completion
gtag('event', 'game_completed', {
  'score': totalScore,
  'date': todayDateString
});

// Track location guesses
gtag('event', 'location_guessed', {
  'location_id': location.id,
  'distance': distance,
  'score': finalScore
});

// Track share button clicks
gtag('event', 'score_shared', {
  'score': totalScore
});
```

### Option B: Simple Custom Analytics

**Pros:**
- No external dependencies
- Full control
- Privacy-focused
- Can use your own backend

**Implementation:**

Create a simple endpoint to log events:

```javascript
// In js/analytics.js
function trackEvent(eventName, data) {
  // Option 1: Send to your own endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: eventName,
      data: data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })
  }).catch(err => console.log('Analytics error:', err));
  
  // Option 2: Log to console (for development)
  if (DEV_MODE) {
    console.log('Analytics:', eventName, data);
  }
}

// Usage
trackEvent('game_completed', { score: 100, date: '2026-01-20' });
trackEvent('location_guessed', { locationId: 0, distance: 150 });
```

### Option C: Privacy-Focused Analytics (Plausible)

**Pros:**
- Privacy-compliant (GDPR, CCPA)
- Lightweight
- Simple dashboard
- Paid but affordable ($9/month)

**Setup:**
- Sign up at https://plausible.io/
- Add script to `index.html`
- No cookies, no personal data collection

## 3. What to Track

### Game Metrics

- **Daily active users** - How many people play each day
- **Game completions** - How many finish all 5 locations
- **Average score** - Mean score per day
- **Location difficulty** - Which locations are hardest (average distance)
- **Share rate** - How many users share their scores
- **Completion rate** - % who finish vs start

### Technical Metrics

- **Page loads** - Total visits
- **Error rate** - Failed API calls, JavaScript errors
- **Load time** - Performance metrics
- **Device types** - Mobile vs desktop usage

### Admin Portal Metrics

- **API key usage** - Google Places API calls
- **Locations edited** - How many dates are updated
- **Validation errors** - Common mistakes in YAML

## 4. Implementation Example

### Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
</script>
```

### Add tracking to game events:

```javascript
// In js/gameLogic.js - after makeGuess()
gtag('event', 'location_guessed', {
  'location_id': location.id,
  'distance_meters': Math.round(distance),
  'score': finalScore,
  'location_name': location.name
});

// In js/gameLogic.js - after game completion
gtag('event', 'game_completed', {
  'total_score': gameState.totalScore,
  'date': getTodayDateString(),
  'locations_completed': Object.keys(gameState.guesses).length
});

// In js/ui.js - after share button click
gtag('event', 'score_shared', {
  'score': gameState.totalScore
});
```

## 5. Privacy Considerations

- **Anonymize IP addresses** - Required for GDPR compliance
- **No personal data** - Don't track names, emails, etc.
- **Cookie consent** - May need banner for EU users
- **Privacy policy** - Update to mention analytics

## 6. Monitoring Dashboard

### Google Analytics Dashboard

Create custom reports for:
- Daily game completions
- Average scores by day
- Most difficult locations
- User retention

### Google Cloud Console

Monitor:
- API quota usage
- Billing alerts
- Error rates
- Request patterns

## Recommendations

1. **Start with Google Analytics 4** - Free, easy, comprehensive
2. **Set up billing alerts** - Monitor Google Maps API costs
3. **Track key events** - Game completion, shares, errors
4. **Review weekly** - Check usage patterns and optimize

## Quick Start

1. Set up Google Analytics 4 account
2. Add tracking code to `index.html`
3. Add event tracking to key game functions
4. Set up Google Cloud billing alerts
5. Review analytics weekly
