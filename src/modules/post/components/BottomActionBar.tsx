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
  initialLiked: boolean;      // 初始点赞状态
  initialLikeCount: number;   // 初始点赞数 ★ 新增
  onRefresh: () => void;      // 评论发送成功后刷新
  onLikeStatusChange?: (liked: boolean) => void;
}

export default function BottomActionBar({
  postId,
  initialLiked,
  initialLikeCount,
  onRefresh,
  onLikeStatusChange,
}: Props) {
  /* ---------- 全局 ---------- */
  const token = useAuthStore((s) => s.token);

  /* ---------- 点赞相关 ---------- */
  const [liked, setLiked]       = useState(initialLiked);
  const [likeCnt, setLikeCnt]   = useState(initialLikeCount);  // 记录数字
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
        method : 'POST',
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, like_status: liked ? 0 : 1 }),
      });
      const j = await res.json();
      if (j.code === 10000) {
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikeCnt((c) => (nextLiked ? c + 1 : c - 1));
        triggerLikeAnim();
        onLikeStatusChange?.(nextLiked);
      } else {
        Alert.alert('操作失败', j.msg || '请稍后再试');
      }
    } catch {
      Alert.alert('网络错误', '请检查网络');
    } finally {
      setLikeLoading(false);
    }
  };

  /* ---------- 发送评论 ---------- */
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || sending) return;
    if (!token) return Alert.alert('请先登录');
    setSending(true);
    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/comment/auth/create', {
        method : 'POST',
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, post_id: postId }),
      });
      const j = await res.json();
      if (j.code === 10000) {
        setText('');
        Keyboard.dismiss();
        onRefresh();                       // 刷新评论
      } else {
        Alert.alert('发送失败', j.msg || '请稍后再试');
      }
    } catch {
      Alert.alert('网络错误', '请检查网络');
    } finally {
      setSending(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <View style={styles.bar}>
      {/* 输入框 + 发送 */}
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

      {/* 点赞：图标 + 数字 */}
      <Pressable style={styles.likeWrapper} onPress={toggleLike}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={26}
            color={liked ? '#ff4d4f' : '#555'}
          />
        </Animated.View>
        <Text style={[styles.likeCnt, liked && { color: '#ff4d4f' }]}>
          {likeCnt}
        </Text>
      </Pressable>
    </View>
  );
}

/* ---------- 样式 ---------- */
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
  /* 输入区 */
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  /* 点赞列 */
  likeWrapper: {
    width: 48,
    alignItems: 'center',
    paddingBottom: 2,
  },
  likeCnt: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});
