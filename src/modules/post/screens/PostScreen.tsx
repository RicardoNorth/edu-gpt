import React, { useEffect, useState, useCallback } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const token = useAuthStore((state) => state.token);
  const setCurrentPost = usePostDetailStore((state) => state.setCurrentPost);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastPid, setLastPid] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchPosts = async (isRefresh = false) => {
    if (!token) return;
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('https://remote.xiaoen.xyz/api/v1/post/auth/list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_pid: isRefresh ? 0 : lastPid,
          size: 5,
        }),
      });

      const resJson = await response.json();
      console.log('拉取帖子返回', resJson);

      if (resJson.code === 10000) {
        const fetchedPosts = resJson.data || [];

        if (isRefresh) {
          setPosts(fetchedPosts);
        } else {
          setPosts((prev) => [...prev, ...fetchedPosts]);
        }

        if (fetchedPosts.length > 0) {
          setLastPid(fetchedPosts[fetchedPosts.length - 1].id);
        }

        setHasMore(fetchedPosts.length >= 5);
      } else {
        Alert.alert('拉取失败', resJson.msg || '请稍后再试');
      }
    } catch (error) {
      console.error('帖子列表请求失败', error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [token]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLastPid(0);
    fetchPosts(true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(false);
    }
  };

  // 如果发完帖子回来，刷新一次
  useEffect(() => {
    if ((route.params as any)?.refresh) {
      handleRefresh();
    }
  }, [route.params]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePostPress = (postId: number) => {
    navigation.navigate('PostDetailScreen', { id: postId }); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 搜索栏 + 发帖按钮 */}
        <View style={styles.searchRow}>
          <Pressable
            style={styles.postButton}
            onPress={() => navigation.navigate('CreatePostScreen')}
          >
            <Text style={styles.postButtonText}>发帖</Text>
          </Pressable>
          <View style={styles.searchInput}>
            <AnimatedSearchBar value={searchText} onChangeText={setSearchText} />
          </View>
        </View>

        {/* 帖子列表 */}
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const formattedContent = item.content.replace(/\n/g, '\\n');
            const preview = formattedContent.split('\\n')[0]; // 只取第一行作为 preview

            return (
              <PostCard
                avatar={require('../../../../assets/default-avatar.png')}
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
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : !hasMore ? (
              <Text style={{ textAlign: 'center', color: '#aaa', marginVertical: 16 }}>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    marginLeft: 8,
  },
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
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
