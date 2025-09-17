import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ListingItem {
  id: string;
  title: string;
  price: number;
  image: string;
  status: 'analyzing' | 'creating' | 'listed' | 'negotiating' | 'offers' | 'sold';
  platform?: string;
  offers?: number;
  bestOffer?: number;
  daysAgo?: number;
  currentOffer?: number;
}

export default function SellingScreen() {
  const insets = useSafeAreaInsets();

  // Mock data - will be replaced with real data
  const listings: ListingItem[] = [
    {
      id: '1',
      title: 'iPhone 13',
      price: 420,
      image: 'https://via.placeholder.com/80',
      status: 'listed',
      platform: 'Facebook',
      daysAgo: 2,
    },
    {
      id: '2',
      title: 'Nike Air Max',
      price: 85,
      image: 'https://via.placeholder.com/80',
      status: 'offers',
      offers: 3,
      bestOffer: 85,
    },
    {
      id: '3',
      title: 'MacBook Pro',
      price: 280,
      image: 'https://via.placeholder.com/80',
      status: 'negotiating',
      currentOffer: 280,
    },
  ];

  const getStatusIcon = (status: ListingItem['status']) => {
    switch (status) {
      case 'analyzing': return '🔍';
      case 'creating': return '📝';
      case 'listed': return '🚀';
      case 'negotiating': return '💬';
      case 'offers': return '🔥';
      case 'sold': return '✅';
      default: return '';
    }
  };

  const getStatusText = (item: ListingItem) => {
    switch (item.status) {
      case 'analyzing': return 'AI analyzing...';
      case 'creating': return 'Creating listing...';
      case 'listed': return `Listed on ${item.platform}`;
      case 'negotiating': return 'Negotiating...';
      case 'offers': return `${item.offers} offers!`;
      case 'sold': return 'SOLD!';
      default: return '';
    }
  };

  const renderListing = (item: ListingItem) => (
    <TouchableOpacity key={item.id} style={styles.listingCard}>
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingStatus}>
          {getStatusIcon(item.status)} {getStatusText(item)}
        </Text>
        <Text style={styles.listingPrice}>${item.price} asking</Text>
        {item.daysAgo && (
          <Text style={styles.listingTime}>⏱️ {item.daysAgo} days ago</Text>
        )}
        {item.bestOffer && (
          <Text style={styles.bestOffer}>Best: ${item.bestOffer}</Text>
        )}
        {item.currentOffer && (
          <Text style={styles.currentOffer}>Current: ${item.currentOffer}</Text>
        )}
      </View>
      {item.status === 'offers' && (
        <View style={styles.actionNeeded}>
          <Text style={styles.actionText}>👆 Tap to decide</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Your AI is selling</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {listings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Tap the camera to start selling!</Text>
          </View>
        ) : (
          listings.map(renderListing)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.subtle,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    ...Typography.title,
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  listingCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.subtle,
  },
  listingInfo: {
    flex: 1,
    marginLeft: 15,
  },
  listingTitle: {
    ...Typography.headline,
    marginBottom: 4,
  },
  listingStatus: {
    ...Typography.body,
    color: Colors.gray,
    marginBottom: 4,
  },
  listingPrice: {
    ...Typography.headline,
    color: Colors.accent,
    marginBottom: 4,
  },
  listingTime: {
    ...Typography.caption,
    color: Colors.gray,
  },
  bestOffer: {
    ...Typography.body,
    color: Colors.warning,
    marginTop: 4,
  },
  currentOffer: {
    ...Typography.body,
    color: Colors.accent,
    marginTop: 4,
  },
  actionNeeded: {
    position: 'absolute',
    bottom: 10,
    right: 15,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.warning,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...Typography.title,
    color: Colors.gray,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.gray,
    marginTop: 10,
  },
});