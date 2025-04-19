import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import { TouchableOpacity, StyleSheet } from 'react-native'

import PostScreen from '../modules/post/screens/PostScreen'
import AnswerScreen from '../modules/answer/screens/AnswerScreen'
import QuestionScreen from '../modules/question/screens/QuestionScreen'
import BattleScreen from '../modules/battle/screens/BattleScreen'

const Tab = createBottomTabNavigator()

function CustomTabBarButton({ children, onPress, style }: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.button, style]}
    >
      {children}
    </TouchableOpacity>
  )
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

          switch (route.name) {
            case '社区':
              iconName = 'chatbubbles-outline'
              break
            case '问题':
              iconName = 'help-circle-outline'
              break
            case '出题':
              iconName = 'create-outline'
              break
            case '对战':
              iconName = 'game-controller-outline'
              break
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
      })}
    >
      <Tab.Screen name="社区" component={PostScreen} />
      <Tab.Screen name="问题" component={AnswerScreen} />
      <Tab.Screen name="出题" component={QuestionScreen} />
      <Tab.Screen name="对战" component={BattleScreen} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})