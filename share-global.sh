#!/bin/bash

echo "🌍 Setting up global sharing for SELL app..."
echo ""

# Kill any existing ngrok processes
pkill ngrok 2>/dev/null

# Start ngrok in background and capture output
echo "Starting ngrok tunnel..."
ngrok http 8081 > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get the public URL from ngrok API
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['tunnels'][0]['public_url'] if data.get('tunnels') else 'Waiting...')" 2>/dev/null)

if [ "$NGROK_URL" != "Waiting..." ]; then
    # Convert https:// to exp://
    EXPO_URL=$(echo $NGROK_URL | sed 's/https:\/\//exp:\/\//')
    
    echo "✅ SUCCESS! Your app is now globally accessible!"
    echo ""
    echo "========================================"
    echo "📱 SHARE THESE WITH YOUR TESTERS:"
    echo "========================================"
    echo ""
    echo "1. Expo Go URL: $EXPO_URL"
    echo "2. Web Preview: $NGROK_URL"
    echo ""
    echo "INSTRUCTIONS FOR TESTERS:"
    echo "1. Install 'Expo Go' app on their phone"
    echo "2. Open Expo Go"
    echo "3. Tap 'Enter URL manually'"
    echo "4. Enter: $EXPO_URL"
    echo ""
    echo "⚠️  Keep this terminal open while sharing!"
    echo "Press Ctrl+C to stop sharing"
    
    # Show ngrok web interface
    echo ""
    echo "📊 Monitor connections at: http://localhost:4040"
    
    # Keep running
    tail -f /tmp/ngrok.log
else
    echo "⚠️  Failed to start ngrok. Please try again."
    echo "Make sure your Expo server is running on port 8081"
fi
