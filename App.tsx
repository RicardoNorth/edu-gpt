import React from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* 状态栏：背景透明，内容根据背景自己调 */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        style={Platform.OS === 'android' ? 'dark' : 'auto'}
      />
      <RootNavigator />
    </View>
  );
}
