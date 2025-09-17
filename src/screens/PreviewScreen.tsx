import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Listing } from '../types';

interface PreviewScreenProps {
  imageUri: string;
  listing: Listing | null;
  isGenerating: boolean;
  onSell: () => void;
  onRetake: () => void;
}

export default function PreviewScreen({ 
  imageUri, 
  listing, 
  isGenerating, 
  onSell, 
  onRetake 
}: PreviewScreenProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      
      <View style={styles.listingCard}>
        {isGenerating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Generating listing...</Text>
          </View>
        ) : listing ? (
          <>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>${listing.price}</Text>
            <Text style={styles.description}>{listing.description}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{listing.category}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>Failed to generate listing</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.sellButton, (!listing || isGenerating) && styles.disabledButton]} 
          onPress={onSell}
          disabled={!listing || isGenerating}
        >
          <Text style={styles.sellButtonText}>SELL</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <Text style={styles.retakeButtonText}>Start Over</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  listingCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: '#E5F2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sellButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  retakeButton: {
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
});