import { createClient } from '@supabase/supabase-js';
import { Listing } from '../types';

// Demo mode for Expo Snack - replace with real credentials when running locally
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'demo-key-for-snack';

// Create a mock client for demo purposes if no real credentials
const createMockClient = () => ({
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'https://placeholder.com/image.jpg' } })
    })
  },
  from: () => ({
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null })
      })
    })
  })
});

export const supabase = (SUPABASE_URL === 'https://demo.supabase.co') 
  ? createMockClient() as any
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function uploadImage(base64Image: string): Promise<string | null> {
  try {
    const fileName = `listing-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from('listings')
      .upload(fileName, decode(base64Image), {
        contentType: 'image/jpeg',
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('listings')
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function uploadAudio(audioUri: string): Promise<string | null> {
  try {
    const response = await fetch(audioUri);
    const blob = await response.blob();
    const fileName = `audio-${Date.now()}.m4a`;
    
    const { data, error } = await supabase.storage
      .from('listings')
      .upload(fileName, blob, {
        contentType: 'audio/m4a',
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('listings')
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading audio:', error);
    return null;
  }
}

export async function saveListing(listing: Listing): Promise<Listing | null> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving listing:', error);
    return null;
  }
}

export async function getUserListings(userId: string): Promise<Listing[]> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}