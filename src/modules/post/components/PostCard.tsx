import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface PostCardProps {
  avatar: any;
  nickname: string;
  title: string;
  preview: string;
  likes: number;
  saves: number;
  onPress?: () => void;
}

export default function PostCard({
  avatar,
  nickname,
  title,
  preview,
  likes,
  saves,
  onPress,
}: PostCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.nickname}>{nickname}</Text>
      </View>
      <Text style={styles.preview}>{preview}</Text>
      <View style={styles.stats}>
        <Text style={styles.statText}>👍 {likes}</Text>
        <Text style={styles.statText}>⭐ {saves}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B333E',
    marginBottom: 4,
  },
  preview: {
    fontSize: 15,
    color: '#666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 6,
    gap: 16,
  },
  statText: {
    fontSize: 12,
    color: '#999',
  },
});
