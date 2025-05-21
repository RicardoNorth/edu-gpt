// src/modules/post/screens/PostDetailScreen.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageViewing from 'react-native-image-viewing';
import { useRoute } from '@react-navigation/native';
import { useAuthStore } from '../../auth/store';

import PostHeader from '../components/PostHeader';
import PostCarousel from '../components/PostCarousel';
import PostContent from '../components/PostContent';
import BottomActionBar from '../components/BottomActionBar';
import CommentItem, { Comment } from '../components/CommentItem';

export default function PostDetailScreen() {
  const route = useRoute();
  const { id } = route.params as { id: number };

  /* --------- 全局登陆态 --------- */
  const token = useAuthStore((s) => s.token);
  const user  = useAuthStore((s) => s.user);

  /* --------- 帖子数据 --------- */
  const [post, setPost]   = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* --------- 评论列表 --------- */
  const [comments, setComments] = useState<Comment[]>([]);
  const [cLastId,  setCLastId]  = useState(0);
  const [cLoading, setCLoading] = useState(false);
  const [cHasMore, setCHasMore] = useState(true);

  /* --------- 大图预览 --------- */
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIdx,     setViewerIdx]     = useState(0);

  /* --------- 工具函数 --------- */
  const blobToBase64 = (b: Blob) =>
    new Promise<string>((re, rj) => {
      const fr = new FileReader();
      fr.onloadend = () => re(fr.result as string);
      fr.onerror   = rj;
      fr.readAsDataURL(b);
    });

  const fetchImgBase64 = async (url: string) => {
    try {
      const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      return await blobToBase64(blob);
    } catch {
      return null;
    }
  };

  /* --------- 拉帖子详情 --------- */
  const loadPost = async () => {
    try {
      const r = await fetch(`https://remote.xiaoen.xyz/api/v1/post/auth/${id}`, {
        method : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await r.json();
      if (j.code !== 10000) throw new Error(j.msg);
      const d = j.data;
      d.is_liked = Number(d.like_status ?? 0);
      d.content  = d.content.replace(/\\n/g, '\n');

      if (d.image_urls?.length) {
        const list = await Promise.all(d.image_urls.map((u: string) => fetchImgBase64(u)));
        setImages(list.filter(Boolean) as string[]);
      }

      setPost(d);
      setLoading(false);
    } catch (e: any) {
      Alert.alert('获取失败', e.message || '请稍后再试');
      setLoading(false);
    }
  };

  /* --------- 拉评论列表 --------- */
  const loadComments = async (refresh = false) => {
    if (!token || cLoading || (!cHasMore && !refresh)) return;
    setCLoading(true);
    try {
      const r = await fetch('https://remote.xiaoen.xyz/api/v1/comment/auth/list', {
        method : 'POST',
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_cid: refresh ? 0 : cLastId,
          post_id : id,
          size    : 10,
        }),
      });
      const j = await r.json();
      if (j.code === 10000) {
        let list: Comment[] = j.data || [];

        if (refresh) {
          list = [...list].sort((a, b) => b.id - a.id);
          setComments(list);
        } else {
          setComments((prev) => [...prev, ...list]);
        }
        if (list.length) setCLastId(list[list.length - 1].id);
        setCHasMore(list.length === 10);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setCLoading(false);
    }
  };

  /* 稳定的刷新函数 */
  const refreshComments = useCallback(() => loadComments(true), [id, token]);

  /* --------- mount --------- */
  useEffect(() => {
    loadPost();
    loadComments(true);
  }, [id]);

  /* --------- 监听自己的头像变化，同步到帖子 --------- */
  useEffect(() => {
    if (!post || !user) return;
    if (post.poster_nickname === user.nickname && user.avatar_url) {
      setPost((prev: any) => ({ ...prev, avatar: user.avatar_url }));
    }
  }, [user?.avatar_url]);           // 只在头像变时触发

  /* --------- Header 用 useMemo，避免多余渲染 --------- */
  const memoHeader = useMemo(() => {
    if (!post) return null;

    // 加版本戳，破缓存
    const avatarUrlWithVersion = `${post.avatar}?v=${Date.now()}`;

    return (
      <>
        <PostHeader
          nickname={post.poster_nickname}
          avatarUrl={avatarUrlWithVersion}
          token={token!}
        />

        {images.length > 0 && (
          <PostCarousel
            imageUrls={images}
            onImagePress={(i) => {
              setViewerIdx(i);
              setViewerVisible(true);
            }}
            onVisibleIndexChange={setViewerIdx}
          />
        )}

        <PostContent
          title={post.title}
          content={post.content}
          department={post.poster_department}
          campus={post.poster_campus}
          createdAt={post.create_at}
        />

        <View style={{ height: 8, backgroundColor: '#f5f5f5', width: '100%' }} />
      </>
    );
  }, [post, images, token]);

  const renderFooter = () =>
    cLoading ? (
      <ActivityIndicator style={{ marginVertical: 12 }} />
    ) : !cHasMore && comments.length ? (
      <Text style={styles.endText}>—— 已经到底啦 ——</Text>
    ) : null;

  const renderItem = ({ item }: ListRenderItemInfo<Comment>) => (
    <CommentItem
      postId={id}
      comment={item}
      onLikeChange={(liked, cnt) =>
        setComments((prev) =>
          prev.map((c) =>
            c.id === item.id ? { ...c, like_status: liked ? 1 : 0, like_count: cnt } : c,
          ),
        )
      }
    />
  );

  /* --------- loading --------- */
  if (loading || !post)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );

  /* --------- 页面 --------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={comments}
        keyExtractor={(it) => it.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={memoHeader}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        onEndReached={() => loadComments(false)}
        onEndReachedThreshold={0.25}
        ListFooterComponent={renderFooter}
      />

      {/* 大图预览 */}
      <ImageViewing
        images={images.map((u) => ({ uri: u }))}
        imageIndex={viewerIdx}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />

      <BottomActionBar
        postId={post.id}
        initialLiked={post.is_liked === 1}
        initialLikeCount={post.like_count}
        onRefresh={refreshComments}
        onLikeStatusChange={(liked) =>
          setPost((p: any) => ({
            ...p,
            is_liked  : liked ? 1 : 0,
            like_count: liked ? p.like_count + 1 : p.like_count - 1,
          }))
        }
      />
    </SafeAreaView>
  );
}

/* --------- 样式 --------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sep: { height: 1, backgroundColor: '#eee', marginLeft: 60 },
  endText: { textAlign: 'center', color: '#999', marginVertical: 8, fontSize: 12 },
});
