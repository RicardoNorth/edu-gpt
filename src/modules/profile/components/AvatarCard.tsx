import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useProfileStore } from '../store';
import { useAuthStore } from '../../auth/store';
import defaultAvatar from '../../../../assets/default-avatar.png';
import ImageViewing from 'react-native-image-viewing';

export default function AvatarCard() {
  const { user } = useProfileStore();
  const { logout } = useAuthStore();
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null); // ✨ 本地缓存 avatarUri

  useEffect(() => {
    if (user?.avatar_path) {
      if (user.avatar_path.startsWith('data:image')) {
        setAvatarUri(user.avatar_path);
      } else {
        setAvatarUri(`${user.avatar_path}?t=${Date.now()}`); // 只在头像变化时加时间戳
      }
    } else {
      setAvatarUri(null);
    }
  }, [user?.avatar_path]); // 监听头像变化

  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity
        onPress={() => {
          if (avatarUri) {
            setIsViewerVisible(true);
          } else {
            Alert.alert('提示', '暂无头像可以预览');
          }
        }}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatarImageLarge}
          />
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

        <Text style={styles.signature}>{user.signature || '这个人很懒，什么都没写～'}</Text>

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

      {/* 大图预览 */}
      <ImageViewing
        images={avatarUri ? [{ uri: avatarUri }] : []}
        imageIndex={0}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
      />
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
  signature: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
    marginTop: 6,
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
