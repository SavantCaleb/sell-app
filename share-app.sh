#!/bin/bash

echo "🚀 Starting SELL App for global sharing..."
echo ""

# Start Expo in the background
echo "Starting Expo server..."
npx expo start --tunnel &
EXPO_PID=$!

# Wait for Expo to start
echo "Waiting for Expo to initialize..."
sleep 10

echo ""
echo "======================================"
echo "📱 YOUR APP IS NOW GLOBALLY ACCESSIBLE!"
echo "======================================"
echo ""
echo "Share these instructions with anyone:"
echo ""
echo "1. Download 'Expo Go' app on their phone:"
echo "   • iPhone: https://apps.apple.com/app/expo-go/id982107779"
echo "   • Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""
echo "2. Open Expo Go and scan the QR code above"
echo "   OR enter the exp:// URL shown above"
echo ""
echo "3. The SELL app will load on their device!"
echo ""
echo "⚠️  Keep this terminal window open while sharing"
echo "Press Ctrl+C to stop sharing"
echo ""

# Keep script running
wait $EXPO_PID
