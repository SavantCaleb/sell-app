# 🚀 Quick Share Instructions

## Currently Running Expo Server
Your Expo server is running at: `http://localhost:8081`

## To Share Globally (2 Simple Options):

### Option 1: Use ngrok (Most Reliable)
```bash
# In a new terminal:
ngrok http 8081
```
This will give you a public URL like `https://xxxxx.ngrok.io`
Share this URL with testers.

### Option 2: Share Your Local Network
1. Find your computer's IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   
2. Share this with testers:
   - **Your Expo URL:** `exp://YOUR_IP:8081`
   - Example: `exp://192.168.1.100:8081`
   
3. They need:
   - **Expo Go app** installed
   - Enter the exp:// URL manually in Expo Go

## For Your Current Setup:
Since Expo is already running on port 8081, the easiest is:

1. Open a new terminal
2. Run: `ngrok http 8081`
3. Share the ngrok URL
4. Tell testers to:
   - Install Expo Go
   - Replace `https://` with `exp://` in the URL
   - Enter it in Expo Go

Example: If ngrok gives you `https://abc123.ngrok.io`
Testers should use: `exp://abc123.ngrok.io`
