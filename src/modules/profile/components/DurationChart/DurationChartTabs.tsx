import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  activeTab: 'today' | 'week' | 'year';
  onTabChange: (tab: 'today' | 'week' | 'year') => void;
}

export default function DurationChartTabs({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.tabRow}>
      {[
        { key: 'today', label: '本日' },
        { key: 'week', label: '本月' },
        { key: 'year', label: '本年' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabButton,
            activeTab === tab.key && styles.activeTabButton,
          ]}
          onPress={() => onTabChange(tab.key as any)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  activeTabButton: {
    borderColor: '#2B333E',
    backgroundColor: '#2B333E',
  },
  tabText: {
    fontSize: 13,
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});
