import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { usePostDetailStore } from '../store/postDetailStore';
import { useAuthStore } from '../../auth/store';
import AnimatedSearchBar from '../components/AnimatedSearchBar';
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
  useHideTabBarOnKeyboard();
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const token = useAuthStore((s) => s.token);

  const flatListRef = useRef<FlatListType>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastPid, setLastPid] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');

  /** 拉列表 */
  const fetchPosts = async (isRefresh = false) => {
    if (!token || loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        'https://remote.xiaoen.xyz/api/v1/post/auth/list',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            last_pid: isRefresh ? 0 : lastPid,
            size: 5,
          }),
        }
      );
      const json = await res.json();
      if (json.code === 10000) {
        const list: Post[] = json.data ?? [];
        setPosts((prev) =>
          isRefresh ? list : [...prev, ...list]
        );
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

  /** 首次进入根据 token 拉一次 */
  useEffect(() => {
    fetchPosts(true);
  }, [token]);

  /** 下拉刷新 */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLastPid(0);
    fetchPosts(true);
  }, []);

  /** 点击同 Tab 图标：只滚顶 */
  // @ts-ignore Stack 类型无 tabPress，但运行时可冒泡
  useEffect(() => {
    const tabNav = navigation
    .getParent() // PostStack
    ?.getParent<BottomTabNavigationProp<BottomTabParamList>>(); // BottomTab

    const unsub = tabNav?.addListener('tabPress', () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  });
    return unsub;
  }, [navigation]);

  /** 每次页面重新聚焦：滚顶 + 刷新一次 */
  useFocusEffect(
    useCallback(() => {
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
      fetchPosts(true);
    }, [token])
  );

  /** 分页 */
  const handleLoadMore = () => {
    if (!loading && hasMore) fetchPosts(false);
  };

  /** 發帖后 route.params?.refresh 也可触发手动刷新 */
  useEffect(() => {
    if ((route.params as any)?.refresh) handleRefresh();
  }, [route.params]);

  /** 搜索过滤 */
  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePostPress = (id: number) =>
    navigation.navigate('PostDetailScreen', { id });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 顶栏 */}
        <View style={styles.searchRow}>
          <Pressable
            style={styles.postButton}
            onPress={() => navigation.navigate('CreatePostScreen')}
          >
            <Text style={styles.postButtonText}>发帖</Text>
          </Pressable>
          <View style={styles.searchInput}>
            <AnimatedSearchBar
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* 列表 */}
        <FlatList
          ref={flatListRef}
          data={filtered}
          keyExtractor={(i) => i.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
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
                saves={item.collect_count}
                onPress={() => handlePostPress(item.id)}
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : !hasMore ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#aaa',
                  marginVertical: 16,
                }}
              >
                已经到底了
              </Text>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginRight: 8, marginLeft: 8 },
  postButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  separator: { height: 1, backgroundColor: '#eee' },
});
