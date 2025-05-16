import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { useAuthStore } from '../../auth/store';
import CommentItem from './CommentItem';

/* ---------- 类型 ---------- */
export interface Comment {
  id: number;
  content: string;
  avatar_url: string;
  poster_nickname: string;
  create_at: string;
  like_count: number;
  like_status?: number; // 0 / 1
  comment_count: number; // 回复条数
}

interface Props {
  postId: number;
}

export interface PostCommentsHandle {
  /** 供外部插入一条新评论到顶部 */
  prependComment: (c: Comment) => void;
}

/* ---------- 组件 ---------- */
function PostComments({ postId }: Props, ref: React.Ref<PostCommentsHandle>) {
  const token = useAuthStore((s) => s.token);

  const [comments, setComments] = useState<Comment[]>([]);
  const [lastCid, setLastCid] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* 拉取列表 */
  const fetchComments = async (isRefresh = false) => {
    if (!token) return;
    if (loadingMore && !isRefresh) return;

    isRefresh ? setRefreshing(true) : setLoadingMore(true);

    try {
      const res = await fetch('https://remote.xiaoen.xyz/api/v1/comment/auth/list', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_cid: isRefresh ? 0 : lastCid,
          post_id: postId,
          size: 10,
        }),
      });
      const json = await res.json();

      if (json.code === 10000) {
        const list: Comment[] = json.data || [];
        setComments((prev) =>
          isRefresh ? list : [...prev, ...list]
        );
        if (list.length) setLastCid(list[list.length - 1].id);
        setHasMore(list.length === 10);
      }
    } catch (e) {
      console.error('评论列表获取失败', e);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  /* 首次加载 / postId 改变时刷新 */
  useEffect(() => {
    fetchComments(true);
  }, [postId]);

  /* -------- 供外部调用的方法 -------- */
  const prependComment = (newComment: Comment) =>
    setComments((prev) => [newComment, ...prev]);

  /* 把方法暴露给父组件 */
  useImperativeHandle(
    ref,
    () => ({
      prependComment,
    }),
    []
  );

  /* 点赞状态变化（由 CommentItem 回调） */
  const updateLikeStatus = (cid: number, liked: boolean, newCnt: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, like_status: liked ? 1 : 0, like_count: newCnt }
          : c
      )
    );
  };

  /* -------- 渲染列表 -------- */
  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CommentItem
            postId={postId}
            comment={item}
            onLikeChange={(status, cnt) =>
              updateLikeStatus(item.id, status, cnt)
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchComments(true)}
          />
        }
        onEndReached={() => hasMore && fetchComments(false)}
        onEndReachedThreshold={0.25}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : !hasMore && comments.length ? (
            <Text style={styles.endText}>—— 已经到底啦 ——</Text>
          ) : null
        }
      />
    </View>
  );
}

/* 必须用 forwardRef 包装，父组件才能拿到 ref */
export default forwardRef(PostComments);

/* ---------- 样式 ---------- */
const styles = StyleSheet.create({
  container: { marginTop: 16, flex: 1 },
  separator: { height: 1, backgroundColor: '#eee', marginLeft: 60 },
  endText: { textAlign: 'center', color: '#999', marginVertical: 8, fontSize: 12 },
});
