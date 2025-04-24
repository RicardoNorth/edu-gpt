import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CNToolbar from 'react-native-cn-richtext-editor/src/CNToolbar';
import { Bold, Underline, Strikethrough } from 'lucide-react-native';
import { getInitialObject, getDefaultStyles } from 'react-native-cn-richtext-editor';
import CNEditor from 'react-native-cn-richtext-editor';
import { useNavigation } from '@react-navigation/native';
import { usePostCardStore } from '../store/postCardStore';

const defaultStyles = getDefaultStyles();

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const editorRef = useRef<any>(null);
  const addPost = usePostCardStore((state) => state.addPost);

  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState([getInitialObject()]);
  const [selectedTag, setSelectedTag] = useState<string>('body');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleSubmit = () => {
    if (!title || editorContent.length === 0) {
      Alert.alert('请输入标题和内容');
      return;
    }

    const newPost = {
      id: Math.random().toString(),
      avatar: require('../../../../assets/default-avatar.png'),
      nickname: '你自己',
      title,
      preview: editorContent[0]?.content?.[0]?.text?.slice(0, 40) + '...',
      likes: 0,
      saves: 0,
      content: JSON.stringify(editorContent),
    };

    addPost(newPost);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        {/* ✅ 顶部小发布按钮，不与状态栏重叠 */}
        {isKeyboardVisible && (
          <TouchableOpacity
            style={[styles.floatingButton, { top: insets.top + 8 }]}
            onPress={handleSubmit}
          >
            <Text style={styles.floatingButtonText}>发布</Text>
          </TouchableOpacity>
        )}

        <View style={styles.container}>
          <Text style={styles.label}>标题</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入标题"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>内容</Text>
          <CNEditor
            ref={editorRef}
            style={styles.editor}
            onSelectedTagChanged={setSelectedTag}
            onSelectedStyleChanged={setSelectedStyles}
            onValueChanged={setEditorContent}
            placeholder="请输入内容"
            value={editorContent}
            styleList={defaultStyles}
            onFocus={() => setIsKeyboardVisible(true)}
          />

          {/* ✅ 工具栏没有边框、贴近输入法 */}
          {isKeyboardVisible && (
            <CNToolbar
              style={styles.toolbar}
              iconSetContainerStyle={{ flexGrow: 1 }}
              size={24}
              selectedTag={selectedTag}
              selectedStyles={selectedStyles}
              onStyleKeyPress={(tool) => editorRef.current?.applyToolbar(tool)}
              iconSet={[
                {
                  type: 'tool',
                  iconArray: [
                    { toolTypeText: 'bold', buttonTypes: 'style', iconComponent: <Bold size={20} /> },
                    { toolTypeText: 'underline', buttonTypes: 'style', iconComponent: <Underline size={20} /> },
                    { toolTypeText: 'lineThrough', buttonTypes: 'style', iconComponent: <Strikethrough size={20} /> },
                  ],
                },
              ]}
            />
          )}

          {!isKeyboardVisible && (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>发布</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderRadius: 0,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 4,
  },
  editor: {
    minHeight: 200,
    fontSize: 16,
    color: '#333',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
  toolbar: {
    paddingVertical: 6,
  },
  button: {
    backgroundColor: '#2B333E',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
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
});
