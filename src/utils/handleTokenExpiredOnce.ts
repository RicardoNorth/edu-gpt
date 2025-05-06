import { Alert } from 'react-native';
import { useAuthStore } from '../modules/auth/store';

let hasShownTokenExpiredAlert = false;

export const handleTokenExpiredOnce = () => {
  if (hasShownTokenExpiredAlert) return;
  hasShownTokenExpiredAlert = true;

  Alert.alert('登录失效', '请重新登录', [
    {
      text: '确定',
      onPress: () => {
        const logout = useAuthStore.getState().logout;
        logout();
        hasShownTokenExpiredAlert = false;
      },
    },
  ]);
};
