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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
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
  const [images, setImages] = useState<{ uri: string; type: string; name: string }[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ⬅️ 新增提交状态

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
      const asset = result.assets[0];
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      const newImage = {
        uri: manipulated.uri,
        type: 'image/png',
        name: `image_${Date.now()}.png`,
      };
      setImages([...images, newImage]);
    }
  };

  const handleImagePress = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleRemoveImage = () => {
    if (!selectedImage) return;
    setImages(images.filter((img) => img.uri !== selectedImage));
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
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('json', JSON.stringify({ title, content }));

      images.forEach((img) => {
        formData.append('postimage', {
          uri: img.uri,
          type: img.type,
          name: img.name,
        } as any);
      });

      const response = await fetch('https://remote.xiaoen.xyz/api/v1/post/auth/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const resJson = await response.json();
      console.log('发帖返回', resJson);

      if (resJson.code === 10000) {
        const newPost = {
          id: resJson.data.id.toString(),
          avatar: require('../../../../assets/default-avatar.png'),
          nickname: '你自己',
          title,
          content,
          preview: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
          image: images.map((img) => img.uri),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        {isKeyboardVisible && !isSubmitting && (
          <TouchableOpacity
            style={[styles.floatingButton, { top: insets.top + 8 }]}
            onPress={handleSubmit}
          >
            <Text style={styles.floatingButtonText}>发布</Text>
          </TouchableOpacity>
        )}

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.imageRow}>
            {images.map((img, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePress(img.uri)}>
                <Image source={{ uri: img.uri }} style={styles.imageThumb} />
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

          {!isKeyboardVisible && !isSubmitting && (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>发布</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* 加载中遮罩层 */}
        {isSubmitting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>发布中...</Text>
          </View>
        )}

        {/* 图片操作弹窗 */}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});
