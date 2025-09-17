# 🌍 How to Share Your SELL App Prototype Globally

You have 3 options to share your app with anyone in the world:

## Option 1: Expo Tunnel (Easiest - Recommended)

1. **Start the app with tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```

2. **Wait for the QR code to appear** (this may take 20-30 seconds)

3. **Share with others:**
   - They need to download **Expo Go** app:
     - iPhone: [App Store Link](https://apps.apple.com/app/expo-go/id982107779)
     - Android: [Google Play Link](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Send them the QR code screenshot OR the `exp://` URL
   - They scan the QR code or enter the URL in Expo Go

## Option 2: Using the Share Script

1. **Run the automated script:**
   ```bash
   ./share-app.sh
   ```

2. **Share the QR code or URL** that appears

## Option 3: Deploy to Expo's Servers (Most Reliable)

1. **Create an Expo account** (free):
   ```bash
   npx expo register
   ```

2. **Login:**
   ```bash
   npx expo login
   ```

3. **Publish your app:**
   ```bash
   npx expo publish
   ```

4. **Share the published URL** with anyone
   - Your app will have a permanent URL like: `exp://u.expo.dev/@username/sell-app`

## Important Notes:

- **Keep your terminal open** while sharing (for Options 1 & 2)
- The person testing needs **Expo Go** app installed
- They must be connected to the internet
- The app will work on both iOS and Android
- For Option 1 & 2: Your computer must stay on and connected
- For Option 3: The app stays available even after you close your computer

## Quick Start Command:

```bash
npx expo start --tunnel
```

## Troubleshooting:

- If tunnel doesn't work, install ngrok: `brew install ngrok`
- If QR code doesn't load, try Option 3 (most reliable)
- Make sure your firewall isn't blocking connections

## What Your Testers Will See:

1. They open Expo Go app
2. Scan your QR code or enter the URL
3. The app downloads and opens
4. They can use the camera to capture items
5. The AI will generate listings (if API keys are set)

---

**Current Status:** Your app is ready to share! Just run `npx expo start --tunnel` and share the QR code.
