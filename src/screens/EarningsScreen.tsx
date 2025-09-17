import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EarningsScreen() {
  const insets = useSafeAreaInsets();

  // Mock data - will be connected to real data later
  const stats = {
    thisMonth: 247.50,
    thisWeek: 65,
    totalSold: 12,
    avgCommission: 18,
    nextPayout: 'Friday',
    lastSold: {
      item: 'iPhone 12',
      soldFor: 336,
      yourCut: 269,
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Month Earnings */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.periodLabel}>This Month</Text>
          <Text style={styles.bigMoney}>${stats.thisMonth.toFixed(2)}</Text>
        </View>

        {/* Weekly Progress */}
        <View style={styles.weeklyCard}>
          <Text style={styles.progressIcon}>📈</Text>
          <Text style={styles.progressText}>+${stats.thisWeek} this week</Text>
        </View>

        {/* Just Sold Card */}
        {stats.lastSold && (
          <View style={styles.soldCard}>
            <Text style={styles.soldEmoji}>💸</Text>
            <Text style={styles.soldTitle}>Just sold:</Text>
            <Text style={styles.soldItem}>
              {stats.lastSold.item} → ${stats.lastSold.soldFor}
            </Text>
            <Text style={styles.yourCut}>Your cut: ${stats.lastSold.yourCut}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.withdrawButton}>
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reinvestButton}>
                <Text style={styles.reinvestButtonText}>Reinvest</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total sold:</Text>
            <Text style={styles.statValue}>{stats.totalSold} items</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Avg commission:</Text>
            <Text style={styles.statValue}>{stats.avgCommission}%</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Next payout:</Text>
            <Text style={styles.statValue}>{stats.nextPayout}</Text>
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity style={styles.mainWithdrawButton}>
          <Text style={styles.mainWithdrawText}>Withdraw to Bank</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.subtle,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  periodLabel: {
    ...Typography.body,
    color: Colors.gray,
    marginBottom: 10,
  },
  bigMoney: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.accent,
  },
  weeklyCard: {
    backgroundColor: Colors.primary,
    margin: 15,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  progressText: {
    ...Typography.headline,
    color: Colors.accent,
  },
  soldCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  soldEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  soldTitle: {
    ...Typography.headline,
    marginBottom: 10,
  },
  soldItem: {
    ...Typography.body,
    fontSize: 20,
    marginBottom: 5,
  },
  yourCut: {
    ...Typography.money,
    fontSize: 28,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  withdrawButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  withdrawButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  reinvestButton: {
    borderWidth: 2,
    borderColor: Colors.accent,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reinvestButtonText: {
    ...Typography.body,
    color: Colors.accent,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: Colors.primary,
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statLabel: {
    ...Typography.body,
    color: Colors.gray,
  },
  statValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  mainWithdrawButton: {
    backgroundColor: Colors.accent,
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  mainWithdrawText: {
    ...Typography.headline,
    color: Colors.primary,
    fontWeight: '700',
  },
});