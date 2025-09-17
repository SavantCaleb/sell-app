require('dotenv').config();
const express = require('express');
const cors = require('cors');
const MarketplaceBot = require('./marketplace-bot');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store bot instances per user session
const bots = new Map();

app.post('/api/marketplace/init', async (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default';
  
  try {
    const bot = new MarketplaceBot();
    await bot.init();
    bots.set(sessionId, bot);
    
    res.json({ success: true, message: 'Bot initialized' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/marketplace/login', async (req, res) => {
  const { email, password } = req.body;
  const sessionId = req.headers['x-session-id'] || 'default';
  
  const bot = bots.get(sessionId);
  if (!bot) {
    return res.status(400).json({ success: false, error: 'Bot not initialized' });
  }
  
  try {
    const success = await bot.login(email, password);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/marketplace/post', async (req, res) => {
  const { listing } = req.body;
  const sessionId = req.headers['x-session-id'] || 'default';
  
  const bot = bots.get(sessionId);
  if (!bot) {
    return res.status(400).json({ success: false, error: 'Bot not initialized' });
  }
  
  try {
    const result = await bot.createListing(listing);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/marketplace/close', async (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default';
  
  const bot = bots.get(sessionId);
  if (bot) {
    await bot.close();
    bots.delete(sessionId);
  }
  
  res.json({ success: true });
});

// Fallback: Generate a shareable link for manual posting
app.post('/api/marketplace/generate-link', (req, res) => {
  const { listing } = req.body;
  
  // Create a pre-filled Facebook Marketplace URL (note: this is a simplified approach)
  const marketplaceUrl = `https://www.facebook.com/marketplace/create/item`;
  
  // Return the listing data formatted for manual entry
  res.json({
    success: true,
    url: marketplaceUrl,
    instructions: 'Copy and paste the following into Facebook Marketplace:',
    listing: {
      title: listing.title,
      price: `$${listing.price}`,
      description: listing.description,
      category: listing.category
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Marketplace automation server running on port ${PORT}`);
});

// Cleanup on exit
process.on('SIGINT', async () => {
  for (const bot of bots.values()) {
    await bot.close();
  }
  process.exit(0);
});