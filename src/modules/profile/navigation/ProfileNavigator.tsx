import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BrowseHistoryScreen from '../screens/BrowseHistoryScreen'; // 浏览记录空壳，顺手加上

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  BrowseHistory: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="BrowseHistory" component={BrowseHistoryScreen} />
    </Stack.Navigator>
  );
}
