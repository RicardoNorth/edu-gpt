import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Bot, FileQuestion, Gamepad2, ScanFace, Telescope} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import PostScreen from '../modules/post/screens/PostScreen';
import AnswerScreen from '../modules/answer/screens/AnswerScreen';
import QuestionScreen from '../modules/question/screens/QuestionScreen';
import BattleScreen from '../modules/battle/screens/BattleScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';
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
            case '出题':
              return <FileQuestion size={size} color={color} />;
            case '对战':
              return <Gamepad2 size={size} color={color} />;
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
      <Tab.Screen name="出题" component={QuestionScreen} />
      <Tab.Screen name="对战" component={BattleScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}