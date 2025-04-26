import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageItemProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userAlign : styles.aiAlign]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.messageText, isUser && styles.userMessageText]}>
        {message.content}
      </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    flexDirection: 'row',
    maxWidth: '80%',
  },
  userAlign: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiAlign: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  aiBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  userMessageText: {
    color: '#ffffff', // 用户发的消息字体白色
  },
  
});
