import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 搜索栏 + 发帖按钮 */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('CreatePostScreen')}
          >
            <Text style={styles.postButtonText}>发帖</Text>
          </TouchableOpacity>

          <View style={styles.searchInput}>
            <AnimatedSearchBar value={searchText} onChangeText={setSearchText} />
          </View>
        </View>

        {/* 帖子列表 */}
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
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
