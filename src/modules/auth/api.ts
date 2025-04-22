export const login = async (username: string, password: string) => {
  const response = await fetch('http://8.140.19.139:8080/api/v1/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const text = await response.text();
  console.log('💥 raw response text:', text);

  try {
    const res = JSON.parse(text);
    return res;
  } catch (err) {
    console.error('JSON 解析失败:', err);
    throw new Error('服务器响应格式错误（不是 JSON）');
  }
};
