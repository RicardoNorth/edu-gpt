import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useHideTabBarOnKeyboard } from '../../../hooks/useHideTabBarOnKeyboard';
import AnimatedSearchBar from '../components/AnimatedSearchBar';
import PostCard from '../components/PostCard';
import { usePostCardStore } from '../store/postCardStore';
import { usePostDetailStore } from '../store/postDetailStore';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'MainApp'>;

export default function PostListScreen() {
  useHideTabBarOnKeyboard();
  const navigation = useNavigation<Navigation>();
  const posts = usePostCardStore((state) => state.posts);
  const setCurrentPost = usePostDetailStore((state) => state.setCurrentPost);
  const [searchText, setSearchText] = useState('');

  const flatListRef = useRef<FlatList>(null); // ✅ 新增：FlatList的ref

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // ✅ 当页面重新focus时，比如从发帖页返回，自动滚到列表最顶
  useFocusEffect(
    React.useCallback(() => {
      if (flatListRef.current && posts.length > 0) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }, [posts])
  );

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
          ref={flatListRef} // ✅ 绑定ref
          data={filteredPosts}
          extraData={posts}
          keyExtractor={(item, index) => `${item.id}-${index}`} // ✅ 保证 key 不冲突
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <PostCard
              avatar={item.avatar}
              nickname={item.nickname}
              title={item.title}
              preview={item.preview}
              likes={item.likes}
              saves={item.saves}
              onPress={() => {
                setCurrentPost(item);
                navigation.navigate('PostDetailScreen');
              }}
            />
          )}
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
