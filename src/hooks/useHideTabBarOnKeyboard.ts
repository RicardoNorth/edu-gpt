import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useTabBarStore } from './useTabBarStore';

export const useHideTabBarOnKeyboard = () => {
  const setVisible = useTabBarStore((state) => state.setVisible);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setVisible(false));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setVisible(true));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
};
