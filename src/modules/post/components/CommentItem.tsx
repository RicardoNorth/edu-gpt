// src/modules/post/components/CommentItem.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '../../auth/store';
import ReplyItem from './ReplyItem';

interface Comment {
  id: number;
  poster_nickname: string;
  avatar_url: string;
  content: string;
  create_at: string;
  like_count: number;
  like_status?: number;
  comment_count: number;
}
export type { Comment };

interface Props {
  postId: number;
  comment: Comment;
  onLikeChange: (liked: boolean, newCount: number) => void;
}

export default function CommentItem({ postId, comment, onLikeChange }: Props) {
  /* ========== 全局登录态 ========== */
  const token = useAuthStore((s) => s.token);
  const user  = useAuthStore((s) => s.user);        // 取当前登录用户

  /* ========== 点赞本地状态 ========== */
  const [liked,   setLiked]   = useState(comment.like_status === 1);
  const [likeCnt, setLikeCnt] = useState(comment.like_count);

  /* ========== 回复相关 ========== */
  const [showReplies,  setShowReplies]  = useState(false);
  const [replies,      setReplies]      = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [lastScid,     setLastScid]     = useState(0);
  const [hasMoreReply, setHasMoreReply] = useState(true);

  /* ========== 头像本地状态 ========== */
  // 先用接口返回的 URL；如果这条评论是“我自己”发的，后面会更新
  const [avatarUrl, setAvatarUrl] = useState(comment.avatar_url);

  /* ========= 接口点赞后，同步父组件 & 本地 ========== */
  useEffect(() => {
    setLiked(comment.like_status === 1);
    setLikeCnt(comment.like_count);
  }, [comment.like_status, comment.like_count]);

  /* ========= 当我换头像时，把自己的评论头像同步过来 ========== */
  useEffect(() => {
    if (!user) return;
    if (comment.poster_nickname === user.nickname && user.avatar_url) {
      setAvatarUrl(user.avatar_url);     // 写入最新 URL
    }
  }, [user?.avatar_url]);

  /* ========= 封装最终用于 <Image> 的 uri，带版本戳破缓存 ========== */
  const avatarSrc = `${avatarUrl}?v=${Date.now()}`;

  /* ========= 点赞 / 取消点赞 ========== */
  const toggleLike = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/comment/auth/like', {
        method : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          comment_id : comment.id,
          like_status: liked ? 0 : 1,
        }),
      });
      const json = await res.json();
      if (json.code === 10000) {
        setLiked(json.like_status === 1);
        setLikeCnt(json.like_count);
        onLikeChange(json.like_status === 1, json.like_count);
      }
    } catch (e) {
      Alert.alert('操作失败', '请稍后再试');
    }
  };

  /* ========= 拉取回复 ========== */
  const fetchReplies = async (isRefresh = false) => {
    if (!token || loadingReplies) return;
    setLoadingReplies(true);
    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/comment/auth/listreply', {
        method : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          last_scid: isRefresh ? 0 : lastScid,
          parent   : comment.id,
          size     : 10,
        }),
      });
      const json = await res.json();
      if (json.code === 10000) {
        const list = json.data || [];
        if (isRefresh) setReplies(list);
        else setReplies((prev) => [...prev, ...list]);

        if (list.length) setLastScid(list[list.length - 1].id);
        setHasMoreReply(list.length === 10);
      }
    } catch (e) {
      console.error('拉回复失败', e);
    } finally {
      setLoadingReplies(false);
    }
  };

  const toggleReplies = () => {
    if (!showReplies && replies.length === 0) fetchReplies(true);
    setShowReplies(!showReplies);
  };

  /* ========== UI ========== */
  return (
    <View style={styles.wrapper}>
      {/* 头像 */}
      <Image
        source={{
          uri: avatarSrc,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }}
        style={styles.avatar}
        contentFit="cover"
      />

      {/* 右侧内容 */}
      <View style={{ flex: 1 }}>
        <Text style={styles.nickname}>{comment.poster_nickname}</Text>
        <Text style={styles.content}>{comment.content}</Text>

        {/* 日期 + 回复按钮 + 点赞 */}
        <View style={styles.row}>
          <Text style={styles.date}>{comment.create_at.slice(0, 10)}</Text>

          <Pressable hitSlop={4} onPress={toggleReplies}>
            <Text style={styles.replyBtn}>回复</Text>
          </Pressable>

          <Pressable style={styles.likeArea} onPress={toggleLike} hitSlop={4}>
            <Ionicons
              name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={16}
              color={liked ? '#007aff' : '#777'}
            />
            <Text style={[styles.likeCnt, liked && { color: '#007aff' }]}>{likeCnt}</Text>
          </Pressable>
        </View>

        {/* 展开回复 */}
        {showReplies && (
          <View style={styles.replyContainer}>
            {replies.map((r) => (
              <ReplyItem key={r.id} reply={r} />
            ))}

            {loadingReplies && <ActivityIndicator size="small" />}

            {hasMoreReply && !loadingReplies && (
              <Pressable onPress={() => fetchReplies(false)}>
                <Text style={styles.loadMoreTxt}>加载更多回复</Text>
              </Pressable>
            )}
          </View>
        )}

        {!showReplies && comment.comment_count > 0 && (
          <Pressable onPress={toggleReplies} style={styles.viewReplyBtn}>
            <Text style={styles.viewReplyTxt}>
              查看 {comment.comment_count} 条回复 &gt;
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ---------- 样式 ---------- */
const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', paddingVertical: 12, paddingRight: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 12 },
  nickname: { fontWeight: '600', color: '#333', marginBottom: 2 },
  content: { color: '#111', fontSize: 15, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  date: { color: '#888', fontSize: 12 },
  replyBtn: { marginHorizontal: 16, color: '#007aff', fontSize: 13 },
  likeArea: { flexDirection: 'row', alignItems: 'center' },
  likeCnt: { marginLeft: 4, fontSize: 12, color: '#777' },
  replyContainer: { marginTop: 8, marginLeft: 44 },
  loadMoreTxt: { fontSize: 12, color: '#007aff', marginTop: 6 },
  viewReplyBtn: { marginTop: 4 },
  viewReplyTxt: { fontSize: 13, color: '#007aff' },
});
