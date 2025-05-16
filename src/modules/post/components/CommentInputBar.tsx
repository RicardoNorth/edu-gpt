// src/modules/post/components/CommentInputBar.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  onSubmit: (text: string, clear: () => void) => void;
}

export default function CommentInputBar({ onSubmit }: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit(text.trim(), () => setText(''));
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="说点什么~"
        multiline
      />
      <Pressable style={styles.sendBtn} onPress={handleSend}>
        <Ionicons name="send" size={22} color="#007aff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    fontSize: 15,
  },
  sendBtn: { paddingHorizontal: 10, paddingBottom: 4 },
});
