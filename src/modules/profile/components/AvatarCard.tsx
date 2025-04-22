import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '../store';
import defaultAvatar from '../../../../assets/default-avatar.png';
import { useAuthStore } from '../../auth/store';

export default function AvatarCard() {
  const { user, setAvatar } = useProfileStore();
  const logout = useAuthStore((state) => state.logout);

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
      setAvatar(selectedUri); // ✅ 更新 avatar_path 到 Zustand
    }
  };

  if (!user) return null; // 防止未登录时渲染

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={pickImage}>
        {user.avatar_path ? (
          <Image source={{ uri: user.avatar_path }} style={styles.avatarImageLarge} />
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
    marginLeft: 15,
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
