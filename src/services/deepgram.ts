const DEEPGRAM_API_KEY = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY || 'YOUR_DEEPGRAM_API_KEY';

export async function transcribeAudioWithDeepgram(audioUri: string): Promise<string> {
  try {
    console.log('Transcribing audio with Deepgram...');
    
    // Fetch the audio file as a blob
    const audioResponse = await fetch(audioUri);
    const audioBlob = await audioResponse.blob();
    
    // For Deepgram, we need to send the audio directly as binary
    // Use Deepgram API directly (better for React Native)
    const deepgramResponse = await fetch('https://api.deepgram.com/v1/listen?punctuate=true&language=en-US&model=nova-2', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/wav', // Send as audio binary
      },
      body: audioBlob, // Send the blob directly
    });
    
    const result = await deepgramResponse.json();
    
    // Extract the transcript
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    console.log('Deepgram transcript:', transcript);
    
    return transcript;
  } catch (error) {
    console.error('Deepgram transcription error:', error);
    return '';
  }
}

