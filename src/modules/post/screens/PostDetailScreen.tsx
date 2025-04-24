import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePostDetailStore } from '../store/postDetailStore';

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const post = usePostDetailStore((state) => state.currentPost);

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>暂无内容</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>帖子详情</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.userInfo}>
          <Image source={post.avatar} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.nickname}>{post.nickname}</Text>
            <Text style={styles.signature}>泛若不系之舟</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>+ 关注</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.content}>{post.content}</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn}>
          <Ionicons name="person-add-outline" size={20} color="#333" />
          <Text style={styles.bottomText}>关注</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Ionicons name="triangle-outline" size={20} color="#333" />
          <Text style={styles.bottomText}>3215</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Ionicons name="caret-down-outline" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Ionicons name="star-outline" size={20} color="#333" />
          <Text style={styles.bottomText}>2380</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Ionicons name="chatbubble-outline" size={20} color="#333" />
          <Text style={styles.bottomText}>372</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#2B333E',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // 留出底部栏空间
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B333E',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  signature: {
    fontSize: 13,
    color: '#888',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2B333E',
  },
  followText: {
    fontSize: 13,
    color: '#2B333E',
    fontWeight: '500',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 8,
  },
  bottomBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
