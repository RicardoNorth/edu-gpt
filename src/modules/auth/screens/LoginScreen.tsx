import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store';
import { useProfileStore } from '../../profile/store';
import { login } from '../api';
import { getUserInfo } from '../../profile/api';
import { mergeUserInfo } from '../../../utils/user';
import { fetchAvatarUrl } from '../../profile/api/fetchAvatarUrl';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login: setIsLoggedIn, setToken } = useAuthStore();
  const setUser = useProfileStore((state) => state.setUser);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!/^\d{6,20}$/.test(studentId)) {
      setError('学号格式错误');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位');
      setLoading(false);
      return;
    }

    try {
      const res = await login(studentId, password);
      if (res.code === 10000) {
        const token = res.data.token;
        setToken(token);

        const userInfoRes = await getUserInfo();
        if (userInfoRes.code === 10000) {
          const localUser = useProfileStore.getState().user;
          const mergedUser = mergeUserInfo(userInfoRes.data, localUser);
          setUser(mergedUser);
          await fetchAvatarUrl();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* 跳过按钮 */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            setIsLoggedIn();
          }}
        >
          <Text style={styles.skipText}>跳过</Text>
        </TouchableOpacity>

        {/* 登录内容 */}
        <View style={styles.container}>
          <Text style={styles.title}>信息门户，登录一下</Text>
          <TextInput
            style={styles.input}
            placeholder="学号"
            keyboardType="numeric"
            value={studentId}
            onChangeText={setStudentId}
          />
          <TextInput
            style={styles.input}
            placeholder="密码"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error !== '' && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>登录</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2b333e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 6,
  },
  skipText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
});
