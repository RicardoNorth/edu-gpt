import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Pencil } from 'lucide-react-native';
import MessageItem from '../components/MessageItem';
import { askAI } from '../api/answerApi';
import { usePromptStore } from '../store/promptStore'; // 引入 store 拿 aiName

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AnswerScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '我是工大小灵通，工大信息我更懂' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();
  const { aiName } = usePromptStore(); // 拿ai名称

  const showTypingEffect = (fullText: string, targetId: string) => {
    let index = 0;
    const typingInterval = 30;
    let isCursorVisible = true;
  
    // 光标闪烁
    const cursorInterval = setInterval(() => {
      isCursorVisible = !isCursorVisible;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === targetId
            ? {
                ...msg,
                content: msg.content.replace(/\|?$/, isCursorVisible ? '｜' : ''),
              }
            : msg
        )
      );
    }, 500);
  
    // 打字机逐字输出
    const typing = setInterval(() => {
      index++;
  
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === targetId
            ? { ...msg, content: fullText.slice(0, index) + (isCursorVisible ? '｜' : '') }
            : msg
        )
      );
  
      if (index >= fullText.length) {
        clearInterval(typing);
        clearInterval(cursorInterval);
  
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === targetId
              ? { ...msg, content: fullText }
              : msg
          )
        );
      }
    }, typingInterval);
  };
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();
  
    const loadingMessageId = (Date.now() + 1).toString();
    const loadingStages = ['.', '..', '...'];
    let stageIndex = 0;
  
    setMessages((prev) => [...prev, {
      id: loadingMessageId,
      role: 'assistant',
      content: '.',
    }]);
  
    const loadingInterval = setInterval(() => {
      stageIndex = (stageIndex + 1) % loadingStages.length;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, content: loadingStages[stageIndex] }
            : msg
        )
      );
    }, 300);
  
    try {
      const aiReplyText = await askAI(userMessage.content);
  
      clearInterval(loadingInterval);
  
      showTypingEffect(aiReplyText, loadingMessageId);
    } catch (error) {
      clearInterval(loadingInterval);
  
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, content: 'AI接口出错了，请稍后再试。' }
            : msg
        )
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶栏 */}
      <View style={styles.header}>
        <Text style={styles.aiName}>{aiName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditAIScreen')}>
          <Pencil size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 聊天消息区 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem message={item} />}
        contentContainerStyle={styles.chatContainer}
        bounces={true}
      />

      {/* 输入框 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="请输入你的问题..."
            placeholderTextColor="#9aa9bf"
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>发送</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  aiName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 3
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#cde5fd',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
