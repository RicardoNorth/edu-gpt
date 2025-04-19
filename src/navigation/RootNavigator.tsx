// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PostScreen from '../modules/post/screens/PostScreen' // 👈 模块路径

export type RootStackParamList = {
  Home: undefined
  Posts: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Posts" component={PostScreen} />
    </Stack.Navigator>
  )
}
