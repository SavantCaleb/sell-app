# SELL - AI Marketplace Assistant

*Point. Speak. Sell. Get Paid.*

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- iOS Simulator (Mac) or Android emulator
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (free tier)
- OpenAI API key

### Setup Instructions

1. **Clone and Install**
```bash
git clone <your-repo>
cd sell-app
npm install
```

2. **Configure Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
EXPO_PUBLIC_API_URL=http://localhost:3001
```

3. **Set up Supabase**
- Create a new Supabase project at https://supabase.com
- Go to SQL Editor and run the schema from `supabase/schema.sql`
- Copy your project URL and anon key to `.env`

4. **Start the Backend (Optional - for automation)**
```bash
cd backend
npm install
cp .env.example .env
npm start
```

5. **Run the App**
```bash
# In the root directory
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

## 📱 How It Works

1. **Capture**: Open app → Point at item → Tap capture button
2. **Describe**: Record 10-second voice description
3. **AI Magic**: GPT-4V generates optimized listing
4. **Sell**: One tap to post to marketplace

## 🏗️ Project Structure

```
sell-app/
├── App.tsx                 # Main app component
├── src/
│   ├── screens/           # App screens
│   │   ├── CameraScreen.tsx
│   │   └── PreviewScreen.tsx
│   ├── services/          # API integrations
│   │   ├── openai.ts      # AI listing generation
│   │   ├── supabase.ts    # Database & storage
│   │   └── marketplace.ts # Facebook integration
│   └── types/             # TypeScript definitions
├── backend/               # Automation server
│   ├── server.js         # Express API
│   └── marketplace-bot.js # Playwright automation
└── supabase/
    └── schema.sql        # Database schema
```

## 🔧 Configuration

### Supabase Setup
1. Create a new project
2. Run the SQL schema
3. Enable Storage for 'listings' bucket
4. Copy credentials to `.env`

### OpenAI Setup
1. Get API key from https://platform.openai.com
2. Ensure you have GPT-4V access
3. Add key to `.env`

### Facebook Marketplace
- Currently uses manual posting flow
- Automated posting available via backend service (experimental)

## 🚢 Building for Production

### iOS (TestFlight)
```bash
npx eas build --platform ios
npx eas submit -p ios
```

### Android (Google Play)
```bash
npx eas build --platform android
npx eas submit -p android
```

## 📊 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `EXPO_PUBLIC_OPENAI_API_KEY` | OpenAI API key | Yes |
| `EXPO_PUBLIC_API_URL` | Backend API URL | No |

## 🧪 Testing

```bash
# Run the app in development
npx expo start

# Test on physical device
npx expo start --tunnel
```

## 🐛 Troubleshooting

### Camera not working
- Ensure permissions are granted in device settings
- Restart the app after granting permissions

### OpenAI errors
- Check API key is valid
- Ensure you have credits and GPT-4V access

### Supabase connection issues
- Verify URL and key are correct
- Check Supabase project is active

## 📝 Roadmap

- [x] Camera capture & voice recording
- [x] AI listing generation
- [x] Supabase integration
- [x] Facebook Marketplace link
- [ ] Multiple marketplace support
- [ ] In-app messaging
- [ ] Payment processing
- [ ] Analytics dashboard

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- Issues: https://github.com/yourusername/sell-app/issues
- Email: support@sellapp.com

---

**Built with:** React Native, Expo, TypeScript, Supabase, OpenAI GPT-4V

*"The best UI is no UI. Just point, speak, and sell."*