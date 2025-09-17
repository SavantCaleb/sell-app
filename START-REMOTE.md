# Fix for Remote Sharing (Not on Same WiFi)

## Option 1: Use Snack (Instant - No Download Required)

1. Go to: https://snack.expo.dev
2. Click "Import git repository"
3. Paste your project (or drag files)
4. Share the Snack URL - works instantly!

## Option 2: Fix the Tunnel Download Issue

The "downloading..." stuck happens because Expo Go can't reach the bundler. Here's the fix:

### Step 1: Start Expo with specific tunnel config
```bash
npx expo start --tunnel --lan --host tunnel
```

### Step 2: Wait for full bundle
Wait until you see:
```
Bundling complete
```

### Step 3: Use the tunnel URL
- Look for: `Metro waiting on exp://...`
- Share that exact URL
- Important: Don't use https://, use exp://

## Option 3: Use localtunnel (Alternative)

```bash
# Terminal 1
npx expo start

# Terminal 2  
npx localtunnel --port 19000 --subdomain sell-app
```

Share: `https://sell-app.loca.lt`
Password: Your public IP (get it from https://whatismyip.com)

## Option 4: Deploy to Vercel (Web Version)

```bash
npx expo export --platform web
vercel --prod
```

## Why It Gets Stuck

The "downloading..." happens when:
1. Expo Go can't reach the Metro bundler
2. The tunnel isn't forwarding websocket connections
3. The bundle is too large for tunnel

## Quick Debug

1. Check if Metro is actually running:
   - Go to http://localhost:19000
   - Should see Expo Dev Tools

2. Check tunnel is working:
   - Go to your tunnel URL in browser
   - Should see something (even if error)

3. Try IP directly (if possible):
   - Get your public IP
   - Port forward 19000 on router
   - Use exp://YOUR_PUBLIC_IP:19000
