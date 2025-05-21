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
import ReplyItem, { Reply } from './ReplyItem';

export interface Comment {
  id: number;
  poster_nickname: string;
  poster_id: number;
  avatar_url: string;
  content: string;
  create_at: string;
  like_count: number;
  like_status?: number;
  comment_count: number;
}

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
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [liked, setLiked] = useState(comment.like_status === 1);
  const [likeCnt, setLikeCnt] = useState(comment.like_count);

  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [lastScid, setLastScid] = useState(0);
  const [hasMoreReply, setHasMoreReply] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3); // 当前展示的数量

  const [avatarUrl, setAvatarUrl] = useState(comment.avatar_url);
  useEffect(() => {
    if (
      user &&
      comment.poster_nickname === user.nickname &&
      user.avatar_url
    ) {
      setAvatarUrl(user.avatar_url);
    }
  }, [user?.avatar_url]);

  const avatarSrc = `${avatarUrl}?v=${Date.now()}`;

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
        }
      );
      const j = await res.json();
      if (j.code === 10000) {
        setLiked(j.like_status === 1);
        setLikeCnt(j.like_count);
        onLikeChange(j.like_status === 1, j.like_count);
      }
    } catch {
      Alert.alert('操作失败', '请稍后再试');
    }
  };

  const fetchReplies = async () => {
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
            last_scid: 0,
            parent: comment.id,
            size: 100,
          }),
        }
      );
      const j = await res.json();
      if (j.code === 10000) {
        const list: Reply[] = j.data || [];
        setReplies(list);
        setHasMoreReply(list.length > 3);
      }
    } catch {
      console.error('拉回复失败');
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (showReplies && replies.length === 0) fetchReplies();
  }, [showReplies]);

  const handleReplyPress = () => {
    onReplyIntent({
      parent: comment.id,
      reply: comment.poster_id,
      nick: comment.poster_nickname,
    });
    setShowReplies(true);
  };

  const renderFlatReplies = () => {
    return replies.slice(0, visibleCount).map((r) => {
      const replyToNick =
        r.reply === comment.poster_id
          ? comment.poster_nickname
          : replies.find((x) => x.poster_id === r.reply)?.poster_nickname || '用户';

      return (
        <View key={r.id} style={{ marginTop: 8, marginLeft: 12 }}>
          <ReplyItem
            commentId={comment.id}
            reply={r}
            replyToNick={replyToNick}
            onReplyIntent={onReplyIntent}
          />
        </View>
      );
    });
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

        {showReplies && (
          <View style={styles.replyContainer}>
            {renderFlatReplies()}
            {loadingReplies && <ActivityIndicator size="small" />}
            {replies.length > visibleCount && (
              <Pressable onPress={() => setVisibleCount((c) => c + 3)}>
                <Text style={styles.loadMoreTxt}>查看更多回复</Text>
              </Pressable>
            )}
          </View>
        )}

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

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 12,
  },
  nickname: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  content: {
    color: '#111',
    fontSize: 15,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  replyBtn: {
    marginHorizontal: 16,
    color: '#007aff',
    fontSize: 13,
  },
  likeArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCnt: {
    marginLeft: 4,
    fontSize: 12,
    color: '#777',
  },
  replyContainer: {
    marginTop: 8,
    marginLeft: -14,
  },
  loadMoreTxt: {
    fontSize: 13,
    color: '#007aff',
    marginTop: 6,
    marginLeft: 20
  },
  viewReplyBtn: {
    marginTop: 4,
  },
  viewReplyTxt: {
    fontSize: 13,
    color: '#007aff',
  },
});
