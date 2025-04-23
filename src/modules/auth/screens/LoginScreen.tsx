import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../store';
import { useProfileStore } from '../../profile/store';
import { login } from '../api';
import { getUserInfo } from '../../profile/api';
import { mergeUserInfo } from '../../../utils/user';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login: setIsLoggedIn, setToken } = useAuthStore();
  const setUser = useProfileStore((state) => state.setUser);

  const handleLogin = async () => {
    setError('');

    if (!/^\d{6,20}$/.test(studentId)) {
      setError('学号格式错误');
      return;
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }

    try {
      const res = await login(studentId, password);
      if (res.code === 10000) {
        const token = res.data.token;
        setToken(token); // ✅ 全局存储 token

        const userInfoRes = await getUserInfo();
        if (userInfoRes.code === 10000) {
          const localUser = useProfileStore.getState().user;
          const mergedUser = mergeUserInfo(userInfoRes.data, localUser);
          setUser(mergedUser);
          setIsLoggedIn();
        } else {
          setError('获取用户信息失败');
        }
      } else if (res.code === 40001) {
        setError('信息门户登录失败');
      } else if (res.code === 40002) {
        setError('信息门户内部问题，请重试');
      } else {
        setError(res.msg || '登录失败');
      }
    } catch (err) {
      console.error(err);
      setError('网络异常');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>登录</Text>
      <TextInput style={styles.input} placeholder="学号" keyboardType="numeric" value={studentId} onChangeText={setStudentId} />
      <TextInput style={styles.input} placeholder="密码" secureTextEntry value={password} onChangeText={setPassword} />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2b333e', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 16 },
  error: { color: 'red', textAlign: 'center', marginTop: 8 },
});
