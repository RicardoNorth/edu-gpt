import { useAuthStore } from '../../auth/store';
import { useProfileStore } from '../store';
import { Platform } from 'react-native';

export const fetchAvatarUrl = async () => {
  const user = useProfileStore.getState().user;
  const token = useAuthStore.getState().token;

  if (!user?.id || !token) {
    console.warn('用户ID或token为空，无法拉取头像');
    return;
  }

  try {
    const response = await fetch(`https://remote.xiaoen.xyz/api/v1/user/auth/avatar/${user.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await response.blob();

    const reader = new FileReader();
    reader.onloadend = () => {
      let base64data = reader.result as string;

      // 🛠️ 关键修正：
      base64data = base64data.replace('application/octet-stream', 'image/jpeg');

      console.log('✅ 修正后的Base64:', base64data);

      useProfileStore.getState().setAvatar(base64data);
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('拉取头像出错:', error);
  }
};


