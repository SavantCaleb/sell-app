import { Listing } from '../types';
import { Alert, Linking } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export async function postToMarketplace(listing: Listing): Promise<boolean> {
  try {
    // Try automated posting first
    const response = await fetch(`${API_URL}/api/marketplace/generate-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listing }),
    });

    const data = await response.json();
    
    if (data.success) {
      // For now, open Facebook Marketplace and show instructions
      Alert.alert(
        'Post to Facebook Marketplace',
        `1. Tap OK to open Facebook Marketplace\n2. Create new listing\n3. Copy this info:\n\nTitle: ${data.listing.title}\nPrice: ${data.listing.price}\nDescription: ${data.listing.description}`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Open Facebook',
            onPress: () => {
              Linking.openURL(data.url);
            }
          }
        ]
      );
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to post to marketplace:', error);
    
    // Fallback: Show manual instructions
    Alert.alert(
      'Manual Posting Required',
      `Please post manually to Facebook Marketplace:\n\nTitle: ${listing.title}\nPrice: $${listing.price}\nDescription: ${listing.description}`,
      [
        {
          text: 'Open Facebook',
          onPress: () => {
            Linking.openURL('https://www.facebook.com/marketplace/create/item');
          }
        }
      ]
    );
    
    return false;
  }
}

export async function checkMarketplaceStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    return false;
  }
}