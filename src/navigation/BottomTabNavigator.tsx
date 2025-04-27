import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Bot,
  FileQuestion,
  MessageCircle,
  ScanFace,
  Telescope,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import PostScreen from '../modules/post/screens/PostScreen';
import AnswerScreen from '../modules/answer/screens/AnswerScreen';
import QuestionScreen from '../modules/question/screens/QuestionScreen';
import MessageScreen from '../modules/message/screens/MessageScreen';
import ProfileNavigator from '../modules/profile/navigation/ProfileNavigator';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import AnimatedTabBarButton from './components/AnimatedTabBarButton';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsTabVisible(false));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsTabVisible(true));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarStyle: isTabVisible ? undefined : { display: 'none' },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case '社区':
              return <Telescope size={size} color={color} />;
            case '秒答':
              return <Bot color={color} size={size} />;
            case '题库':
              return <FileQuestion size={size} color={color} />;
            case '消息':
              return <MessageCircle size={size} color={color} />;
            case '我的':
              return <ScanFace size={size} color={color} />;
            default:
              return <Ionicons name="home" size={size} color={color} />;
          }
        },
        tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
      })}
    >
      <Tab.Screen name="社区" component={PostScreen} />
      <Tab.Screen name="秒答" component={AnswerScreen} />
      <Tab.Screen name="题库" component={QuestionScreen} />
      <Tab.Screen name="消息" component={MessageScreen} />
      <Tab.Screen name="我的" component={ProfileNavigator} 
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileMain';
          if (routeName === 'EditProfile' || routeName === 'BrowseHistory') {
            return {tabBarStyle: { display: 'none' },};
          }
          return {};
        }}
      />
    </Tab.Navigator>
  );
}
