// src/modules/post/components/ReplyItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface Props {
  reply: {
    avatar_url: string;
    poster_nickname: string;
    content: string;
    create_at: string;
  };
}

export default function ReplyItem({ reply }: Props) {
  return (
    <View style={styles.wrapper}>
      <Image source={{ uri: reply.avatar_url }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.nickname}>{reply.poster_nickname}</Text>
        <Text style={styles.content}>{reply.content}</Text>
        <Text style={styles.date}>{reply.create_at.slice(0, 10)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', marginTop: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  nickname: { fontWeight: '600', color: '#333' },
  content: { color: '#111', marginVertical: 2 },
  date: { fontSize: 11, color: '#999' },
});
