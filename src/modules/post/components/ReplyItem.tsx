// src/modules/post/components/ReplyItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useAuthStore } from '../../auth/store';

interface Reply {
  id: number;
  poster_nickname: string;
  avatar_url: string;
  content: string;
  create_at: string;
}

export default function ReplyItem({ reply }: { reply: Reply }) {
  /* 取全局 token，用于带鉴权头 */
  const token = useAuthStore((s) => s.token);

  /* 加版本戳，破缓存 */
  const avatarSrc = `${reply.avatar_url}?v=${Date.now()}`;

  return (
    <View style={styles.row}>
      <Image
        source={{
          uri: avatarSrc,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.nick}>{reply.poster_nickname}</Text>
        <Text style={styles.content}>{reply.content}</Text>
        <Text style={styles.date}>{reply.create_at.slice(0, 10)}</Text>
      </View>
    </View>
  );
}

/* ---------- 样式 ---------- */
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  nick: { fontSize: 13, fontWeight: '600', color: '#333' },
  content: { fontSize: 14, color: '#111', marginVertical: 2 },
  date: { fontSize: 11, color: '#888' },
});
