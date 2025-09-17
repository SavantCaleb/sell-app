const { chromium } = require('playwright');

class MarketplaceBot {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    this.browser = await chromium.launch({
      headless: false, // Set to true in production
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    this.page = await this.context.newPage();
  }

  async login(email, password) {
    try {
      await this.page.goto('https://www.facebook.com/marketplace');
      
      // Check if already logged in
      const isLoggedIn = await this.page.evaluate(() => {
        return !window.location.href.includes('/login');
      });
      
      if (!isLoggedIn) {
        await this.page.fill('input[name="email"]', email);
        await this.page.fill('input[name="pass"]', password);
        await this.page.click('button[name="login"]');
        await this.page.waitForNavigation();
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async createListing(listing) {
    try {
      // Navigate to create listing
      await this.page.goto('https://www.facebook.com/marketplace/create/item');
      await this.page.waitForTimeout(2000);
      
      // Upload photos
      const fileInput = await this.page.locator('input[type="file"]');
      if (listing.imageUrl) {
        // Download image and upload
        const response = await fetch(listing.imageUrl);
        const buffer = await response.arrayBuffer();
        await fileInput.setInputFiles({
          name: 'item.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from(buffer)
        });
      }
      
      // Fill in title
      await this.page.fill('input[aria-label*="Title"]', listing.title);
      
      // Fill in price
      await this.page.fill('input[aria-label*="Price"]', String(listing.price));
      
      // Select category (simplified - may need adjustment)
      await this.page.click('div[aria-label*="Category"]');
      await this.page.waitForTimeout(1000);
      await this.page.keyboard.type(listing.category);
      await this.page.keyboard.press('Enter');
      
      // Fill in description
      await this.page.fill('textarea[aria-label*="Description"]', listing.description);
      
      // Set condition (assuming "Used - Like New")
      await this.page.click('div[aria-label*="Condition"]');
      await this.page.click('text="Used - Like New"');
      
      // Set location (will use default)
      
      // Publish
      await this.page.click('button:has-text("Next")');
      await this.page.waitForTimeout(2000);
      await this.page.click('button:has-text("Publish")');
      
      await this.page.waitForTimeout(3000);
      
      return {
        success: true,
        listingUrl: this.page.url()
      };
    } catch (error) {
      console.error('Failed to create listing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = MarketplaceBot;