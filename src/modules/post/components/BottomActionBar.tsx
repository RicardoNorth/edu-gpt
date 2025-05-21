import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Animated,
  TextInput,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../../auth/store';

interface Props {
  /* --- 输入 & 发送 --- */
  placeholder: string;                   // “写评论…” / “回复 @nick：”
  onSend: (text: string) => void;        // 交给父组件决定发评论还是发回复

  /* --- 点赞 --- */
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  onLikeStatusChange?: (liked: boolean) => void;
}

function BottomActionBar(
  {
    placeholder,
    onSend,
    postId,
    initialLiked,
    initialLikeCount,
    onLikeStatusChange,
  }: Props,
  ref: React.Ref<TextInput>,
) {
  /* 全局 token */
  const token = useAuthStore((s) => s.token);

  /* ========== 输入框 ========== */
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  // 让父组件可以 .focus()
  useImperativeHandle(ref, () => inputRef.current!, []);

  const handleSend = () => {
    const content = text.trim();
    if (!content) return;
    onSend(content);
    setText('');
    Keyboard.dismiss();
  };

  /* ========== 点赞 ========== */
  const [liked, setLiked]       = useState(initialLiked);
  const [likeCnt, setLikeCnt]   = useState(initialLikeCount);
  const [loadingLike, setLoadingLike] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulse = () => {
    scaleAnim.setValue(1.2);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
  };

  const toggleLike = async () => {
    if (!token || loadingLike) return;
    setLoadingLike(true);
    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/post/auth/like', {
        method : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body   : JSON.stringify({ post_id: postId, like_status: liked ? 0 : 1 }),
      });
      const j = await res.json();
      if (j.code === 10000) {
        const next = !liked;
        setLiked(next);
        setLikeCnt((c) => (next ? c + 1 : c - 1));
        pulse();
        onLikeStatusChange?.(next);
      }
    } catch { /* ignore */ }
    setLoadingLike(false);
  };

  /* ========== UI ========== */
  return (
    <View style={styles.bar}>
      {/* 输入区 */}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          multiline
        />
        <Pressable onPress={handleSend} disabled={!text.trim()}>
          <Ionicons
            name="send"
            size={22}
            color={text.trim() ? '#007aff' : '#bbb'}
          />
        </Pressable>
      </View>

      {/* 点赞 */}
      <Pressable style={styles.likeWrapper} onPress={toggleLike}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={26}
            color={liked ? '#ff4d4f' : '#555'}
          />
        </Animated.View>
        <Text style={[styles.likeCnt, liked && { color: '#ff4d4f' }]}>{likeCnt}</Text>
      </Pressable>
    </View>
  );
}

export default forwardRef(BottomActionBar);

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
