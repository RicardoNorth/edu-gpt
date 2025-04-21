import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DurationChartToday from './DurationChartToday';
import DurationChartWeek from './DurationChartWeek';
import DurationChartYear from './DurationChartYear';

export default function DurationChart() {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'year'>('week');

  return (
    <View style={styles.card}>
      {/* 顶部 Tabs */}
      <View style={styles.tabRow}>
        {[
          { key: 'today', label: '本日' },
          { key: 'week', label: '本月' },
          { key: 'year', label: '本年' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 当前视图 */}
      <View style={styles.chartBody}>
        {activeTab === 'today' && <DurationChartToday />}
        {activeTab === 'week' && <DurationChartWeek />}
        {activeTab === 'year' && <DurationChartYear />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingTop: 8,
    paddingBottom: 16,
    marginBottom: 24,
    elevation: 3,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#2B333E',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2B333E',
    fontWeight: '600',
  },
  chartBody: {
    paddingHorizontal: 16,
    minHeight: 250,
  },
});
