import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BrowseHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>这里是浏览记录页面，暂未开发～</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  text: { fontSize: 18, color: '#999' },
});
