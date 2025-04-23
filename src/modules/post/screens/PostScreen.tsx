import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import defaultAvatar from '../../../../assets/default-avatar.png';
import { useHideTabBarOnKeyboard } from '../../../hooks/useHideTabBarOnKeyboard';

const dummyPosts = [
  {
    id: '1',
    nickname: '阿少',
    avatar: defaultAvatar,
    title: '大神们是从哪获取优质信息，比如哪些公众号、知乎？',
    preview:
      '越后面越精华，慢慢翻。一个社会的进步，在于每个人能否接受和掌握这个社会积累和创造的知识...',
    likes: 50000,
    saves: 230000,
  },
  {
    id: '2',
    nickname: '平凡',
    avatar: defaultAvatar,
    title: '你博士期间发表了几篇 SCI？',
    preview:
      '论文这个东西，我算是总结出一些窍门了。英国的博士没有对论文的硬性规定...',
    likes: 1093,
    saves: 1780,
  },
  {
    id: '3',
    nickname: '张君',
    avatar: defaultAvatar,
    title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
    preview:
      '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
    likes: 6907,
    saves: 18000,
  },
  {
    id: '4',
    nickname: '张君',
    avatar: defaultAvatar,
    title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
    preview:
      '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
    likes: 6907,
    saves: 18000,
  },
  {
    id: '6',
    nickname: '张君',
    avatar: defaultAvatar,
    title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
    preview:
      '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
    likes: 6907,
    saves: 18000,
  },
  {
    id: '5',
    nickname: '张君',
    avatar: defaultAvatar,
    title: '发现自己什么都不懂、什么都想学，是不是一种病态？',
    preview:
      '只是看书看课，知识非常中空，看得再多，也是低水平重复...',
    likes: 6907,
    saves: 18000,
  },
];

export default function PostListScreen() {
  useHideTabBarOnKeyboard();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 搜索框 */}
        <TextInput style={styles.searchBar} placeholder="搜索帖子" />

        {/* 帖子列表 */}
        <FlatList
          data={dummyPosts}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.header}>
                <Image source={item.avatar} style={styles.avatar} />
                <Text style={styles.nickname}>{item.nickname}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.preview}>{item.preview}</Text>
              <View style={styles.stats}>
                <Text style={styles.statText}>👍 {item.likes}</Text>
                <Text style={styles.statText}>⭐ {item.saves}</Text>
              </View>
            </View>
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
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B333E',
    marginBottom: 4,
  },
  preview: {
    fontSize: 13,
    color: '#666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 6,
    gap: 16,
  },
  statText: {
    fontSize: 12,
    color: '#999',
  },
});
