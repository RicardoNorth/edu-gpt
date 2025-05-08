import React from 'react';
import { View, Text, StyleSheet, Pressable} from 'react-native';
import { Image } from 'expo-image';

interface PostCardProps {
  avatarUrl: string;
  token: string | null;
  nickname: string;
  title: string;
  preview: string;
  likes: number;
  saves: number;
  onPress?: () => void;
}

export default function PostCard({
  avatarUrl,
  token,
  nickname,
  title,
  preview,
  likes,
  saves,
  onPress,
}: PostCardProps) {

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.header}>
        <Image
          source={{
            uri: avatarUrl,
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          }}
          contentFit="cover"
          cachePolicy="memory"
          placeholder={require('../../../../assets/default-avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.nickname}>{nickname}</Text>
      </View>

      <Text style={styles.preview}>{preview}</Text>

      <View style={styles.stats}>
        <Text style={styles.statText}>赞同 {likes}</Text>
        <Text style={styles.statText}>收藏 {saves}</Text>
      </View>
    </Pressable>
  );
}

/* 样式保持不变 */
const styles = StyleSheet.create({
  card: { paddingVertical: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  nickname: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  title: { fontSize: 18, fontWeight: '600', color: '#2B333E', marginBottom: 4 },
  preview: { fontSize: 15, color: '#666' },
  stats: { flexDirection: 'row', gap: 16, marginTop: 6 },
  statText: { fontSize: 12, color: '#999' },
});
