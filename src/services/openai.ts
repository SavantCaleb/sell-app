// Temporarily using fetch API instead of OpenAI SDK for Snack compatibility
import { Listing } from '../types';
import { transcribeAudioWithDeepgram } from './deepgram';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';

export async function transcribeAudio(audioUri: string): Promise<string> {
  try {
    // Use Deepgram for transcription instead of OpenAI Whisper
    const transcript = await transcribeAudioWithDeepgram(audioUri);
    return transcript;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return '';
  }
}

export async function generateListing(
  imageBase64: string, 
  transcription: string
): Promise<Listing | null> {
  try {
    // Optimized prompt for GPT-5-mini based on best practices
    const prompt = `Create a Facebook Marketplace listing from the image and voice description.

Voice: "${transcription}"

Requirements:
1. Title: Catchy, under 80 chars, include main selling point
2. Price: Competitive market price (number only)
3. Description: 2-3 sentences - condition, key features, value proposition
4. Category: Choose from [Electronics, Furniture, Clothing, Home & Garden, Sports, Toys, Books, Auto Parts, Other]

Output JSON only:
{
  "title": "string",
  "price": number,
  "description": "string",
  "category": "string"
}`;

    // Using fetch API for OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { 
                type: 'image_url', 
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                }
              },
            ],
          },
        ],
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');
    
    const listing = JSON.parse(content) as Listing;
    return listing;
  } catch (error) {
    console.error('Error generating listing:', error);
    return null;
  }
}

export async function generateListingFromImageOnly(imageBase64: string): Promise<Listing | null> {
  try {
    // Optimized prompt for GPT-5-mini - concise and structured
    const prompt = `Create a Facebook Marketplace listing from this image alone.

Requirements:
1. Title: Catchy, under 80 chars, highlight main feature
2. Price: Estimate competitive market price (number only)
3. Description: 2-3 sentences - visible condition, features, value
4. Category: Choose from [Electronics, Furniture, Clothing, Home & Garden, Sports, Toys, Books, Auto Parts, Other]

Output JSON only:
{
  "title": "string",
  "price": number,
  "description": "string",
  "category": "string"
}`;

    // Using fetch API for OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { 
                type: 'image_url', 
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                }
              },
            ],
          },
        ],
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');
    
    const listing = JSON.parse(content) as Listing;
    return listing;
  } catch (error) {
    console.error('Error generating listing from image:', error);
    return null;
  }
}