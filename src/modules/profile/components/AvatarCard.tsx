import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '../store';
import defaultAvatar from '../../../../assets/default-avatar.png';
import { useAuthStore } from '../../auth/store';

export default function AvatarCard() {
  const { user, setAvatar } = useProfileStore();
  const token = useAuthStore((state) => state.token);

  const logout = () => {
    useAuthStore.getState().logout();
    useProfileStore.getState().resetProfile(); // ✅ 清空本地缓存的用户信息
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('权限不足', '需要访问媒体库权限才能上传头像');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;

      try {
        const formData = new FormData();

        formData.append('avatar', {
          uri: selectedUri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any); // React Native 类型系统需要断言为 any

        const response = await fetch(`https://remote.xiaoen.xyz/api/v1/user/auth/upload_image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const json = await response.json(); // ✅ 只读取一次

        console.log('🔍 上传响应内容:', json);

        if (json.code === 10000 && json.data?.url) {
          // 拼接成完整url
          const fullUrl = `https://remote.xiaoen.xyz/${json.data.url.replace('127.0.0.1:8080/', '')}`;
          console.log('✅ 最终头像URL:', fullUrl);
          setAvatar(fullUrl); // 更新到全局状态
        } else {
          Alert.alert('上传失败', json.msg || '请稍后再试');
        }
      } catch (error) {
        console.error('上传头像出错:', error);
        Alert.alert('上传失败', '上传过程中发生错误');
      }
    }
  };

  if (!user) return null;
  console.log('🖼️ 当前头像地址:', user.avatar_path);

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={pickImage}>
        {user.avatar_path ? (
          <Image source={{ uri: user.avatar_path }} style={styles.avatarImageLarge} resizeMode="cover"/>
        ) : (
          <View style={styles.avatarPlaceholderLarge}>
            <Image source={defaultAvatar} style={styles.avatarImageLarge} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.nickname}>{user.nickname}</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>退出</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>帖子</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>粉丝</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>19</Text>
            <Text style={styles.statLabel}>关注</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -15,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    zIndex: 10,
  },
  avatarImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  avatarPlaceholderLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffb6c1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B333E',
    marginLeft: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  logout: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginLeft: 15,
  },
  statItem: {
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B333E',
  },
  statLabel: {
    fontSize: 13,
    color: '#333',
  },
});
