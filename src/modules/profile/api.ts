import { useAuthStore } from '../auth/store';

export const getUserInfo = async () => {
  const token = useAuthStore.getState().token;

  const response = await fetch('https://remote.xiaoen.xyz/api/v1/user/auth/get_userinfo', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('⚠️ JSON 解析失败:', text);
    return { code: -1, msg: '响应格式错误', data: null };
  }
};
