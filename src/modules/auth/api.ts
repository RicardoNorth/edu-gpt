export const login = async (username: string, password: string) => {
  const response = await fetch('https://remote.xiaoen.xyz/api/v1/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const text = await response.text();

  try {
    const res = JSON.parse(text);
    return res;
  } catch (err) {
    console.error('JSON 解析失败:', err);
    throw new Error('服务器响应格式错误（不是 JSON）');
  }
};
