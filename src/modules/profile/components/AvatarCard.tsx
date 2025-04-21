import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '../store';
import defaultAvatar from '../../../../assets/default-avatar.png';


export default function AvatarCard() {
  const { user, setAvatar } = useProfileStore();

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
      setAvatar(result.assets[0].uri); 
    }
  };

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={pickImage}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatarImageLarge} />
        ) : (
          <View style={styles.avatarPlaceholderLarge}>
            <Image source={defaultAvatar} style={styles.avatarImageLarge} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.nickname}>{user.nickname}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNumber}>2</Text><Text style={styles.statLabel}>帖子</Text></View>
          <View style={styles.statItem}><Text style={styles.statNumber}>3</Text><Text style={styles.statLabel}>粉丝</Text></View>
          <View style={styles.statItem}><Text style={styles.statNumber}>19</Text><Text style={styles.statLabel}>关注</Text></View>
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
  avatarText: {
    fontSize: 32,
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
