import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import PostDetailScreen from '../modules/post/screens/PostDetailScreen';
import CreatePostScreen from '../modules/post/screens/CreatePostScreen';
import CourseDetailScreen from '../modules/question/screens/CourseDetailScreen';
import { useAuthStore } from '../modules/auth/store';

export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  PostDetailScreen: undefined;
  CreatePostScreen: undefined;
  CourseDetail: { courseId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainApp" component={BottomTabNavigator} />
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
            <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
