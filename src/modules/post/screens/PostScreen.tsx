// src/modules/post/screens/PostListScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import type { FlatList as FlatListType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../../../types/nav';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../auth/store';
import PostCard from '../components/PostCard';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { useHideTabBarOnKeyboard } from '../../../hooks/useHideTabBarOnKeyboard';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'MainApp'>;

interface Post {
  id: number;
  title: string;
  content: string;
  poster_nickname: string;
  like_count: number;
  collect_count: number;
  comment_count: number;
  view_count: number;
  create_at: string;
}

export default function PostListScreen() {
  useHideTabBarOnKeyboard();                      // 隐藏 TabBar（键盘弹出时）

  const navigation = useNavigation<Navigation>();
  const route       = useRoute();
  const token       = useAuthStore((s) => s.token);

  const flatListRef = useRef<FlatListType>(null);

  const [posts,       setPosts]       = useState<Post[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);
  const [lastPid,     setLastPid]     = useState(0);
  const [hasMore,     setHasMore]     = useState(true);

  /* ------------- 拉列表 ------------- */
  const fetchPosts = async (isRefresh = false) => {
    if (!token || loading) return;
    setLoading(true);
    try {
      const res  = await fetch('https://remote.xiaoen.xyz/api/v1/post/auth/list', {
        method : 'POST',
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_pid: isRefresh ? 0 : lastPid,
          size    : 8,
        }),
      });
      const json = await res.json();
      if (json.code === 10000) {
        const list: Post[] = json.data ?? [];
        setPosts((prev) => (isRefresh ? list : [...prev, ...list]));
        if (list.length) setLastPid(list[list.length - 1].id);
        setHasMore(list.length >= 5);
      } else {
        Alert.alert('拉取失败', json.msg || '请稍后再试');
      }
    } catch (e) {
      console.error('帖子列表请求失败', e);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  /* 首次进入根据 token 拉一次 */
  useEffect(() => {
    fetchPosts(true);
  }, [token]);

  /* 下拉刷新 */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLastPid(0);
    fetchPosts(true);
  }, []);

  /* 点击同 Tab 图标：只滚顶 */
  // @ts-ignore Stack 类型无 tabPress，但运行时可冒泡
  useEffect(() => {
    const tabNav = navigation
      .getParent()                                           // PostStack
      ?.getParent<BottomTabNavigationProp<BottomTabParamList>>(); // BottomTab

    const unsub = tabNav?.addListener('tabPress', () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return unsub;
  }, [navigation]);

  /* 每次页面重新聚焦：滚顶 + 刷新一次 */
  useFocusEffect(
    useCallback(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      fetchPosts(true);
    }, [token]),
  );

  /* 分页 */
  const handleLoadMore = () => {
    if (!loading && hasMore) fetchPosts(false);
  };

  /* 發帖后 route.params?.refresh 也可触发手动刷新 */
  useEffect(() => {
    if ((route.params as any)?.refresh) handleRefresh();
  }, [route.params]);

  /* 跳转帖子详情 */
  const handlePostPress = (id: number) => navigation.navigate('PostDetailScreen', { id });

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 帖子列表 */}
        <FlatList
          ref={flatListRef}
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const preview = item.content.split('\n')[0];
            return (
              <PostCard
                avatarUrl={item.avatar_url}
                token={token || null}
                nickname={item.poster_nickname}
                title={item.title}
                preview={preview}
                likes={item.like_count}
                comments={item.comment_count}
                onPress={() => handlePostPress(item.id)}
              />
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : !hasMore ? (
              <Text style={styles.footerText}>已经到底啦~</Text>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />

        {/* 浮动发帖按钮 */}
        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate('CreatePostScreen')}
        >
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* -------------------- 样式 -------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 12 },
  separator: { height: 1, backgroundColor: '#eee' },
  footerText: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 16,
  },
  /* Floating Action Button */
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,             // Android shadow
    shadowColor: '#000',      // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
    includeFontPadding: false,
  },
});
