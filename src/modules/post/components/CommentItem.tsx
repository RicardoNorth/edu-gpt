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
  onReplyIntent: (ctx: { parent: number; reply: number; nick: string }) => void;
}

export default function CommentItem({
  postId,
  comment,
  onLikeChange,
  onReplyIntent,
}: Props) {
  /* 全局 */
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  /* 点赞 */
  const [liked, setLiked] = useState(comment.like_status === 1);
  const [likeCnt, setLikeCnt] = useState(comment.like_count);

  /* 回复列表 */
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [lastScid, setLastScid] = useState(0);
  const [hasMoreReply, setHasMoreReply] = useState(true);
  const [initFetched, setInitFetched] = useState(false);        // ★

  /* 头像同步 */
  const [avatarUrl, setAvatarUrl] = useState(comment.avatar_url);
  useEffect(() => {
    if (user && comment.poster_nickname === user.nickname && user.avatar_url) {
      setAvatarUrl(user.avatar_url);
    }
  }, [user?.avatar_url]);

  const avatarSrc = `${avatarUrl}?v=${Date.now()}`;

  /* 点赞接口 */
  const toggleLike = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        'https://remote.xiaoen.xyz/api/v1/comment/auth/like',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment_id: comment.id,
            like_status: liked ? 0 : 1,
          }),
        },
      );
      const json = await res.json();
      if (json.code === 10000) {
        setLiked(json.like_status === 1);
        setLikeCnt(json.like_count);
        onLikeChange(json.like_status === 1, json.like_count);
      }
    } catch {
      Alert.alert('操作失败', '请稍后再试');
    }
  };

  /* 拉取回复列表 */
  const fetchReplies = async (isRefresh = false) => {
    if (!token || loadingReplies) return;
    setLoadingReplies(true);
    try {
      const res = await fetch(
        'https://remote.xiaoen.xyz/api/v1/comment/auth/listreply',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            last_scid: isRefresh ? 0 : lastScid,
            parent: comment.id,
            size: 10,
          }),
        },
      );
      const json = await res.json();
      console.log('listreply data：', json.data);

      if (json.code === 10000) {
        const list = json.data || [];
        if (isRefresh) setReplies(list);
        else setReplies((prev) => [...prev, ...list]);

        if (list.length) setLastScid(list[list.length - 1].id);
        setHasMoreReply(list.length === 10);
      }
    } catch {
      console.error('拉回复失败');
    } finally {
      setLoadingReplies(false);
    }
  };

  /* 首次挂载：若有子回复就后台预拉 */
  useEffect(() => {
    if (comment.comment_count > 0 && !initFetched) {
      fetchReplies(true);
      setInitFetched(true);
    }
  }, []);

  /* 点击“回复” */
  const handleReplyPress = () => {
    onReplyIntent({
      parent: comment.id,
      reply: 0,
      nick: comment.poster_nickname,
    });
    if (!showReplies) setShowReplies(true);  // 已经预取，直接展开
  };

  return (
    <View style={styles.wrapper}>
      <Image
        source={{
          uri: avatarSrc,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.nickname}>{comment.poster_nickname}</Text>
        <Text style={styles.content}>{comment.content}</Text>

        <View style={styles.row}>
          <Text style={styles.date}>{comment.create_at.slice(0, 10)}</Text>

          <Pressable hitSlop={4} onPress={handleReplyPress}>
            <Text style={styles.replyBtn}>回复</Text>
          </Pressable>

          <Pressable style={styles.likeArea} onPress={toggleLike} hitSlop={4}>
            <Ionicons
              name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={16}
              color={liked ? '#007aff' : '#777'}
            />
            <Text style={[styles.likeCnt, liked && { color: '#007aff' }]}>
              {likeCnt}
            </Text>
          </Pressable>
        </View>

        {/* 展开回复 */}
        {showReplies && (
          <>
            <View style={styles.replyContainer}>
              {replies.map((r) => (
                <ReplyItem key={r.id} reply={r} />
              ))}

              {loadingReplies && <ActivityIndicator size="small" />}

              {hasMoreReply && !loadingReplies && (
                <Pressable onPress={() => fetchReplies(false)}>
                  <Text style={styles.loadMoreTxt}>查看更多回复</Text>
                </Pressable>
              )}
            </View>

            {/* 收起按钮 */}
            <Pressable onPress={() => setShowReplies(false)} style={styles.collapseBtn}>
              <Text style={styles.collapseTxt}>收起回复 ∧</Text>
            </Pressable>
          </>
        )}

        {/* 折叠时入口 */}
        {!showReplies && comment.comment_count > 0 && (
          <Pressable
            onPress={() => setShowReplies(true)}
            style={styles.viewReplyBtn}
          >
            <Text style={styles.viewReplyTxt}>
              查看 {comment.comment_count} 条回复 &gt;
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* 样式 */
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
  replyContainer: { marginTop: 8 },
  loadMoreTxt: { fontSize: 12, color: '#007aff', marginTop: 6 },
  viewReplyBtn: { marginTop: 4 },
  viewReplyTxt: { fontSize: 14, color: '#007aff' },
  collapseBtn: { marginTop: 4},
  collapseTxt: { fontSize: 14, color: '#007aff' },

});
