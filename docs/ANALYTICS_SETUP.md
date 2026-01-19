# Analytics Setup Guide

Simple Google Analytics 4 setup for tracking game metrics.

## Quick Setup

1. **Create a Google Analytics 4 property:**
   - Go to https://analytics.google.com/
   - Click "Admin" → "Create Property"
   - Choose "Web" as the platform
   - Enter property name: "Philly Tap"
   - Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

2. **Add your Measurement ID to `index.html`:**
   - Open `index.html` in a text editor
   - Find the Google Analytics script (around line 16)
   - Replace `YOUR_GA_ID` with your actual Measurement ID:
     ```html
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX', {
         anonymize_ip: true,
         cookie_flags: 'SameSite=None;Secure'
       });
     </script>
     ```

3. **That's it!** Analytics will automatically track:
   - Daily active users
   - Game completions
   - Average scores
   - Location difficulty
   - Share button clicks
   - Error rates

## What's Tracked

### Events Tracked

1. **`page_view`** - When someone visits the game
   - Automatically tracked by Google Analytics

2. **`daily_active_user`** - First interaction each day
   - Tracks unique daily users
   - Fired on first map click/tap

3. **`location_guessed`** - Each location guess
   - `location_id`: 0-4
   - `location_name`: Name of location
   - `distance_meters`: Distance in meters
   - `score`: Points earned
   - Used to calculate location difficulty

4. **`game_completed`** - When all 5 locations are guessed
   - `score`: Total score
   - `locations_completed`: Number of locations (usually 5)
   - `date`: Date of completion
   - Used to calculate completion rate and average score

5. **`score_shared`** - When share button is clicked
   - `score`: Total score shared
   - `date`: Date of share
   - Used to calculate share rate

6. **`exception`** - Errors that occur
   - `description`: Error type and message
   - Used to track error rates

## Viewing Analytics

1. **Go to Google Analytics:** https://analytics.google.com/
2. **Select your property:** "Philly Tap"
3. **View reports:**
   - **Realtime** → See live users
   - **Events** → See all tracked events
   - **Engagement** → See page views and sessions

## Creating Custom Reports

### Daily Active Users
1. Go to **Reports** → **Engagement** → **Events**
2. Filter for event name: `daily_active_user`
3. Group by date

### Game Completions
1. Go to **Reports** → **Engagement** → **Events**
2. Filter for event name: `game_completed`
3. View count and average `score` parameter

### Average Scores
1. Go to **Reports** → **Engagement** → **Events**
2. Filter for event name: `game_completed`
3. View average of `score` parameter

### Location Difficulty
1. Go to **Reports** → **Engagement** → **Events**
2. Filter for event name: `location_guessed`
3. Group by `location_id` or `location_name`
4. View average `distance_meters` parameter
   - Higher distance = harder location

### Share Rate
1. Go to **Reports** → **Engagement** → **Events**
2. Compare `score_shared` events vs `game_completed` events
3. Calculate: shares / completions = share rate

### Error Rate
1. Go to **Reports** → **Engagement** → **Events**
2. Filter for event name: `exception`
3. Count errors per day/week

## Privacy

- **IP anonymization** is enabled by default
- **No personal data** is collected
- Complies with GDPR/CCPA requirements
- Consider adding a privacy policy mentioning analytics

## Troubleshooting

### Analytics not tracking?
- Check browser console for errors (F12)
- Verify Measurement ID is correct
- Make sure you're not using an ad blocker
- Check that `gtag` function is defined

### Events not showing?
- Can take 24-48 hours for data to appear
- Check "Realtime" view for immediate data
- Verify event names match in Analytics

### Need help?
- Google Analytics Help: https://support.google.com/analytics
- Check browser console for tracking errors
- Verify all event tracking calls are present in code
