import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useProfileStore } from '../store';
import { useAuthStore } from '../../auth/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useProfileStore();
  const token = useAuthStore((state) => state.token);

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [signature, setSignature] = useState(user?.signature || '');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setLocalAvatarUri(result.assets[0].uri);
    }
  };

  const uploadAvatarAndGetBase64 = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
  
      const uploadResponse = await fetch('https://remote.xiaoen.xyz/api/v1/user/auth/upload_avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const uploadJson = await uploadResponse.json();
  
      if (uploadJson.code !== 10000 || !uploadJson.data?.url) {
        throw new Error(uploadJson.msg || '头像上传失败');
      }
  
      const imgUrl = uploadJson.data.url;
  
      const avatarResponse = await fetch(imgUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!avatarResponse.ok) {
        throw new Error('头像拉取失败，状态码: ' + avatarResponse.status);
      }
  
      const avatarBlob = await avatarResponse.blob();
      const reader = new FileReader();
  
      const base64String: string = await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          let result = reader.result as string;
          result = result.replace('data:application/octet-stream', 'data:image/jpeg');
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(avatarBlob);
      });
  
      return base64String;
  
    } catch (error) {
      console.error('🔥 uploadAvatarAndGetBase64 出错:', error);
      throw error; // 一定要抛出！不然上层不会捕获
    }
  };
  
  const handleSave = async () => {
  if (!user) return;

  if (nickname.length > 8) {
    Alert.alert('昵称过长', '昵称不能超过8个字');
    return;
  }
  if (signature.length > 17) {
    Alert.alert('签名过长', '签名不能超过17个字');
    return;
  }

  setLoading(true);
  try {
    let newAvatarBase64 = user.avatar_path;

    if (localAvatarUri) {
      newAvatarBase64 = await uploadAvatarAndGetBase64(localAvatarUri);
    }

    const updateRes = await fetch('https://remote.xiaoen.xyz/api/v1/user/auth/update_userinfo', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        nickname,
        signature,
      }),
    });

    const updateJson = await updateRes.json();

    if (updateJson.code === 10000) {
      setUser({
        ...user,
        nickname: updateJson.data.nickname,
        signature: updateJson.data.signature,
        avatar_path: newAvatarBase64,
      });
      Alert.alert('保存成功');
      navigation.goBack();
    } else {
      Alert.alert('保存失败', updateJson.msg || '请稍后再试');
    }
  } catch (error) {
    console.error('保存出错:', error);
    Alert.alert('保存失败', '发生未知错误');
  }
  setLoading(false);
};

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: localAvatarUri || user.avatar_path || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="请输入昵称"
          maxLength={8}
        />
        <Text style={{ alignSelf: 'flex-end', color: '#999', marginBottom: 10 }}>
          {nickname.length}/8
        </Text>

        <Text style={styles.label}>个性签名</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={signature}
          onChangeText={setSignature}
          placeholder="这个人很懒，什么都没写～"
          multiline
          maxLength={17}
        />
        <Text style={{ alignSelf: 'flex-end', color: '#999', marginBottom: 10 }}>
          {signature.length}/17
        </Text>

        <TouchableOpacity
          style={[styles.saveButton, loading && { backgroundColor: '#FAA2AF' }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FAA2AF" />
          ) : (
            <Text style={styles.saveButtonText}>保存</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#ccc',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#FAA2AF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
