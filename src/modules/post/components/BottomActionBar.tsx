import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../../auth/store';
import { useEffect } from 'react';

interface Props {
  postId: number;
  initialLiked: boolean;
  onLikeStatusChange?: (newStatus: boolean) => void;
}

export default function BottomActionBar({ postId, initialLiked, onLikeStatusChange }: Props) {
  const token = useAuthStore((s) => s.token);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const toggleLike = async () => {
    if (!token || loading) return;
    setLoading(true);

    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/post/auth/like', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          like_status: liked ? 0 : 1,
        }),
      });

      const json = await res.json();

      if (json.code === 10000) {
        setLiked((prev) => {
          const newStatus = !prev;
      
          setTimeout(() => {
            onLikeStatusChange?.(newStatus);
          }, 0);
      
          return newStatus;
        });
      } else {
        Alert.alert('操作失败', json.msg || '请稍后再试');
      }
    } catch (err) {
      console.error('点赞失败:', err);
      Alert.alert('网络错误', '请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.bar}>
      <Pressable onPress={toggleLike} style={styles.button}>
        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#ff4d4f' : '#555'} />
        <Text style={styles.label}>点赞</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Ionicons name="bookmark-outline" size={24} color="#555" />
        <Text style={styles.label}>收藏</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Ionicons name="chatbubble-outline" size={24} color="#555" />
        <Text style={styles.label}>评论</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Ionicons name="share-social-outline" size={24} color="#555" />
        <Text style={styles.label}>分享</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});
