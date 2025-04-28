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
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../auth/store';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const token = useAuthStore((state) => state.token);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('json', JSON.stringify({
        title: title,
        content: content.replace(/\n/g, '\\\\n'), // 🔥 注意这里替换成 '\\\\n'
      }));

      images.forEach((uri, index) => {
        formData.append('postimage', {
          uri,
          name: `image${index}.png`,
          type: 'image/png',
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
      console.log('发帖返回：', resJson);

      if (resJson.code === 10000) {
        Alert.alert('发布成功');
        navigation.goBack();
      } else {
        Alert.alert('发布失败', resJson.msg || '请稍后再试');
      }
    } catch (error) {
      console.error('发帖请求失败', error);
      Alert.alert('网络异常', '请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>发布</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
});
