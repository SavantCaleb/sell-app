import { useState } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CameraScreen from './src/screens/CameraScreen';
import SellingScreen from './src/screens/SellingScreen';
import EarningsScreen from './src/screens/EarningsScreen';
import PreviewScreen from './src/screens/PreviewScreen';

import { Listing } from './src/types';
import { 
  transcribeAudio, 
  generateListing, 
  generateListingFromImageOnly 
} from './src/services/openai';
import { 
  uploadImage, 
  uploadAudio, 
  saveListing 
} from './src/services/supabase';
import { postToMarketplace } from './src/services/marketplace';
import { Colors } from './src/constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedAudio, setCapturedAudio] = useState<string | null>(null);
  const [generatedListing, setGeneratedListing] = useState<Listing | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCapture = async (photoUri: string, audioUri: string) => {
    setCapturedImage(photoUri);
    setCapturedAudio(audioUri);
    setShowPreview(true);
    setIsGenerating(true);

    try {
      // Get base64 image for OpenAI
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      
      reader.readAsDataURL(blob);
      const imageBase64 = await base64Promise;

      // Transcribe audio and generate listing
      let listing: Listing | null = null;
      
      if (audioUri) {
        const transcription = await transcribeAudio(audioUri);
        if (transcription) {
          listing = await generateListing(imageBase64, transcription);
        } else {
          listing = await generateListingFromImageOnly(imageBase64);
        }
      } else {
        listing = await generateListingFromImageOnly(imageBase64);
      }

      if (listing) {
        setGeneratedListing(listing);
      } else {
        Alert.alert('Error', 'Failed to generate listing. Please try again.');
      }
    } catch (error) {
      console.error('Error processing capture:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSell = async () => {
    if (!generatedListing || !capturedImage) return;

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      
      reader.readAsDataURL(blob);
      const imageBase64 = await base64Promise;
      
      const imageUrl = await uploadImage(imageBase64);
      
      let audioUrl = null;
      if (capturedAudio) {
        audioUrl = await uploadAudio(capturedAudio);
      }

      const listingToSave: Listing = {
        ...generatedListing,
        imageUrl: imageUrl || undefined,
        audioUrl: audioUrl || undefined,
      };

      const savedListing = await saveListing(listingToSave);
      
      if (savedListing) {
        const posted = await postToMarketplace(savedListing);
        
        if (posted) {
          Alert.alert(
            'Success!', 
            'Your listing has been created and ready to post!',
            [
              { 
                text: 'OK', 
                onPress: () => handleRetake() 
              }
            ]
          );
        }
      } else {
        Alert.alert('Error', 'Failed to save listing. Please try again.');
      }
    } catch (error) {
      console.error('Error posting listing:', error);
      Alert.alert('Error', 'Failed to post listing. Please try again.');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedAudio(null);
    setGeneratedListing(null);
    setShowPreview(false);
  };

  const CameraStackScreen = () => {
    console.log('CameraStackScreen - showPreview:', showPreview, 'capturedImage:', capturedImage);
    
    if (showPreview && capturedImage) {
      return (
        <PreviewScreen
          imageUri={capturedImage}
          listing={generatedListing}
          isGenerating={isGenerating}
          onSell={handleSell}
          onRetake={handleRetake}
        />
      );
    }
    
    console.log('Rendering CameraScreen component');
    return <CameraScreen onCapture={handleCapture} />;
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.accent,
            tabBarInactiveTintColor: Colors.gray,
            tabBarStyle: {
              backgroundColor: Colors.primary,
              borderTopWidth: 0,
              elevation: 8,
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: -2 },
              shadowRadius: 3,
              height: 80,
              paddingBottom: 20,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen 
            name="Camera" 
            component={CameraStackScreen}
            options={{
              tabBarLabel: 'Sell',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: 24, color }}>📸</Text>
              ),
            }}
          />
          <Tab.Screen 
            name="Selling" 
            component={SellingScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: 24, color }}>📦</Text>
              ),
              tabBarBadge: undefined, // Will add badge when there are actions needed
            }}
          />
          <Tab.Screen 
            name="Earnings" 
            component={EarningsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: 24, color }}>💰</Text>
              ),
            }}
          />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});