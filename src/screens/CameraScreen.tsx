import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Audio } from 'expo-av';
import { Colors, Typography } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraScreenProps {
  onCapture?: (photo: string, audio: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraScreen({ onCapture }: CameraScreenProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();

  // Mock earnings for now - will connect to real data later
  const earnings = 247;

  useEffect(() => {
    (async () => {
      try {
        console.log('CameraScreen: Requesting permissions...');
        
        // Request camera permission
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        console.log('CameraScreen: Camera permission status:', cameraStatus);
        
        // Request audio permission
        let audioStatus = 'denied';
        try {
          const audioResult = await Audio.requestPermissionsAsync();
          audioStatus = audioResult.status;
          console.log('CameraScreen: Audio permission status:', audioStatus);
        } catch (audioError) {
          console.log('CameraScreen: Audio permission error:', audioError);
        }
        
        // For now, just check camera permission to unblock the app
        const hasPerms = cameraStatus === 'granted';
        console.log('CameraScreen: Has permissions (camera only for now):', hasPerms);
        setHasPermission(hasPerms);
      } catch (error) {
        console.log('CameraScreen: Permission error:', error);
        setHasPermission(false);
      }
    })();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const takePicture = async () => {
    try {
      console.log('Taking picture...');
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.8,
          base64: true 
        });
        console.log('Photo captured:', photo?.uri ? 'Success' : 'Failed');
        if (photo?.uri) {
          setCapturedPhotoUri(photo.uri);
          setShowVoicePrompt(true);
          // Auto-start recording after a brief delay
          setTimeout(() => startRecording(), 500);
          return;
        }
      }
      
      // Fallback for simulator - use a placeholder
      if (__DEV__) {
        console.log('Using placeholder for simulator');
        const placeholderUri = 'https://via.placeholder.com/400x600/00C853/FFFFFF?text=Test+Item';
        setCapturedPhotoUri(placeholderUri);
        if (onCapture) {
          Alert.alert(
            'Test Mode', 
            'Using placeholder image',
            [
              {
                text: 'OK',
                onPress: () => {
                  onCapture(placeholderUri, '');
                  setCapturedPhotoUri(null);
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const startRecording = async () => {
    try {
      console.log('Starting audio recording...');
      
      // Set up audio mode with proper iOS configuration
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Request recording permissions again just to be sure
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission not granted');
      }

      // Start recording with a simpler preset
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 9) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.log('Recording error:', err);
      // If recording fails, continue without audio
      setShowVoicePrompt(false);
      if (capturedPhotoUri && onCapture) {
        // Skip the alert and just continue with the photo
        setTimeout(() => {
          onCapture(capturedPhotoUri, '');
          setCapturedPhotoUri(null);
          Alert.alert('Processing', 'Analyzing your item from the photo...', [], { cancelable: false });
        }, 100);
      }
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      
      if (uri && capturedPhotoUri && onCapture) {
        // Show success message
        setShowVoicePrompt(false);
        Alert.alert('Perfect!', "We'll handle the rest", [
          {
            text: 'OK',
            onPress: () => {
              onCapture(capturedPhotoUri, uri);
              // Reset state
              setCapturedPhotoUri(null);
              setRecordingDuration(0);
            }
          }
        ]);
      }
    } catch (err) {
      Alert.alert('Failed to stop recording', String(err));
    }
  };

  console.log('CameraScreen render - hasPermission:', hasPermission);

  if (hasPermission === null) {
    console.log('CameraScreen: Still waiting for permissions...');
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }]}>
        <Text style={{ fontSize: 18 }}>Requesting permissions...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    console.log('CameraScreen: Permissions denied');
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }]}>
        <Text style={{ fontSize: 18, textAlign: 'center', padding: 20 }}>
          No access to camera or microphone.{'\n'}
          Please enable in Settings.
        </Text>
      </View>
    );
  }

  console.log('CameraScreen: Rendering camera view...');
  return (
    <View style={styles.container}>
      {/* Earnings Banner */}
      <View style={[styles.earningsBanner, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.earningsLabel}>Earnings</Text>
        <Text style={styles.earningsAmount}>${earnings}</Text>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing="back"
        />
      </View>

      {/* Voice Recording Overlay */}
      {showVoicePrompt && (
        <View style={styles.voiceOverlay}>
          <View style={styles.voiceCard}>
            <Text style={styles.voiceTitle}>
              {isRecording ? `Recording... ${10 - recordingDuration}s` : 'Tell me about this item'}
            </Text>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Speak now...</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Bottom Controls */}
      {!showVoicePrompt && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner}>
              <View style={styles.captureButtonCore} />
            </View>
          </TouchableOpacity>
          <Text style={styles.captureText}>Tap to sell</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.text,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000', // Black background for camera
  },
  camera: {
    flex: 1,
  },
  earningsBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  earningsLabel: {
    ...Typography.body,
    marginRight: 8,
    color: Colors.gray,
  },
  earningsAmount: {
    ...Typography.title,
    color: Colors.accent,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  captureButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
  },
  captureText: {
    ...Typography.body,
    color: Colors.primary,
    fontSize: 18,
  },
  voiceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  voiceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 30,
    width: SCREEN_WIDTH * 0.85,
    alignItems: 'center',
  },
  voiceTitle: {
    ...Typography.title,
    textAlign: 'center',
    marginBottom: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.danger,
    marginRight: 10,
    animationName: 'pulse',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
  recordingText: {
    ...Typography.body,
    color: Colors.gray,
  },
  simulatorNotice: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  simulatorText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  simulatorSubtext: {
    color: Colors.primary,
    fontSize: 14,
    opacity: 0.8,
  },
});