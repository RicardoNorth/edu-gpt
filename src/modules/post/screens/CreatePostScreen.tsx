import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../auth/store'; 
import { usePostCardStore } from '../store/postCardStore'; 

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const token = useAuthStore((state) => state.token);
  const addPost = usePostCardStore((state) => state.addPost);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleImagePress = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleRemoveImage = () => {
    if (!selectedImage) return;
    setImages(images.filter((img) => img !== selectedImage));
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('请输入标题和内容');
      return;
    }

    if (!token) {
      Alert.alert('请先登录');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('image_count', images.length.toString());

      images.forEach((uri, index) => {
        formData.append('postimage', {
          uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        } as any);
      });

      const response = await fetch('https://remote.xiaoen.xyz/api/v1/post/auth/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const resJson = await response.json();

      if (resJson.code === 10000) {
        const newPost = {
          id: resJson.data.id.toString(),
          avatar: require('../../../../assets/default-avatar.png'),
          nickname: '你自己',
          title,
          content,
          preview: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
          image: images,
          likes: 0,
          saves: 0,
        };
        addPost(newPost);

        Alert.alert('发布成功');
        navigation.goBack();
      } else {
        Alert.alert('发布失败', resJson.msg || '请稍后再试');
      }
    } catch (error) {
      console.error('发帖请求失败', error);
      Alert.alert('网络异常', '请检查网络连接');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        {isKeyboardVisible && (
          <TouchableOpacity
            style={[styles.floatingButton, { top: insets.top + 8 }]}
            onPress={handleSubmit}
          >
            <Text style={styles.floatingButtonText}>发布</Text>
          </TouchableOpacity>
        )}

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.imageRow}>
            {images.map((uri, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePress(uri)}>
                <Image source={{ uri }} style={styles.imageThumb} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={handlePickImage} style={styles.imageThumbAdd}>
              <Text style={{ fontSize: 28, color: '#999' }}>＋</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>标题</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入标题"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>内容</Text>
          <TextInput
            style={styles.textarea}
            placeholder="请输入内容"
            value={content}
            onChangeText={setContent}
            multiline
          />

          {!isKeyboardVisible && (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>发布</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <TouchableOpacity style={styles.modalOption} onPress={handleRemoveImage}>
                  <Text style={[styles.modalText, { color: 'red' }]}>删除</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalText}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16 },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  imageThumbAdd: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 12,
    minHeight: 120,
  },
  button: {
    backgroundColor: '#2B333E',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#2B333E',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    zIndex: 100,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 260,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 10,
  },
  modalOption: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
});
