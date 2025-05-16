// src/modules/post/components/BottomActionBar.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Animated,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../../auth/store';

interface Props {
  postId: number;
  initialLiked: boolean;
  /** 发送成功后刷新评论列表 */
  onRefresh: () => void;
  onLikeStatusChange?: (liked: boolean) => void;
}

export default function BottomActionBar({
  postId,
  initialLiked,
  onRefresh,
  onLikeStatusChange,
}: Props) {
  /* ---------------- 全局状态 ---------------- */
  const token = useAuthStore((s) => s.token);

  /* ---------------- 点赞逻辑 ---------------- */
  const [liked, setLiked] = useState(initialLiked);
  const [likeLoading, setLikeLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerLikeAnim = () => {
    scaleAnim.setValue(1.2);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const toggleLike = async () => {
    if (!token || likeLoading) return;
    setLikeLoading(true);

    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/post/auth/like', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, like_status: liked ? 0 : 1 }),
      });
      const json = await res.json();

      if (json.code === 10000) {
        const newStatus = !liked;
        setLiked(newStatus);
        triggerLikeAnim();
        onLikeStatusChange?.(newStatus);
      } else {
        Alert.alert('操作失败', json.msg || '请稍后再试');
      }
    } catch {
      Alert.alert('网络错误', '请检查网络');
    } finally {
      setLikeLoading(false);
    }
  };

  /* ---------------- 发送评论 ---------------- */
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || sending) return;
    if (!token) return Alert.alert('请先登录');

    setSending(true);
    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/comment/auth/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, post_id: postId }),
      });
      const json = await res.json();

      if (json.code === 10000) {
        // 成功：直接通知父组件刷新评论列表
        onRefresh();
        setText('');
        Keyboard.dismiss();
      } else {
        Alert.alert('发送失败', json.msg || '请稍后再试');
      }
    } catch {
      Alert.alert('网络错误', '请检查网络');
    } finally {
      setSending(false);
    }
  };

  /* ---------------- 渲染 ---------------- */
  return (
    <View style={styles.bar}>
      {/* 输入框 */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="写评论..."
          multiline
        />
        <Pressable onPress={handleSend} disabled={sending || !text.trim()}>
          <Ionicons
            name="send"
            size={22}
            color={sending || !text.trim() ? '#bbb' : '#007aff'}
          />
        </Pressable>
      </View>

      {/* 点赞 */}
      <Pressable style={styles.likeBtn} onPress={toggleLike}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={26}
            color={liked ? '#ff4d4f' : '#555'}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

/* ---------------- 样式 ---------------- */
const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 15,
  },
  likeBtn: { alignItems: 'center', paddingHorizontal: 10, paddingBottom: 4 },
});
