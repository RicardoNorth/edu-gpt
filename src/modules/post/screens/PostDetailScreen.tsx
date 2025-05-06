import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';import ImageViewing from 'react-native-image-viewing';
import { useAuthStore } from '../../auth/store';

const screenWidth = Dimensions.get('window').width;

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: number };

  const token = useAuthStore((s) => s.token);                 // ← 复用多次
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  /** 拉取帖子详情 */
  const fetchPostDetail = async () => {
    try {
      if (!token) return;

      const res = await fetch(`https://remote.xiaoen.xyz/api/v1/post/auth/${id}`, {
        method: 'POST',                              // 详情接口仍是 POST
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      console.log('帖子详情返回：', json);

      if (json.code === 10000) {
        const data = json.data;
        data.content = data.content.replace(/\\n/g, '\n'); // 还原换行
        setPost(data);
      } else {
        Alert.alert('获取详情失败', json.msg || '请稍后再试');
      }
    } catch (e) {
      console.error('获取帖子详情出错', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }
  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>加载失败，请返回重试</Text>
      </View>
    );
  }

  /** 供 ImageViewing 使用的图片数组，携带 headers */
  const viewingImages = (post.image_urls || []).map((url: string) => ({
    uri: url,
    headers: { Authorization: `Bearer ${token}` },
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>

        <Image
          source={require('../../../../assets/default-avatar.png')}
          style={styles.headerAvatar}
        />
        <Text style={styles.headerNickname} numberOfLines={1}>
          {post.poster_nickname}
        </Text>

        <Pressable style={styles.headerFollowButton}>
          <Text style={styles.headerFollowText}>关注</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 图片轮播 */}
        {post.image_urls && post.image_urls.length > 0 && (
          <View style={styles.carouselWrapper}>
            <FlatList
              ref={flatListRef}
              data={post.image_urls}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item, index }) => (
                <Pressable
                  style={styles.carouselImageWrapper}
                  android_ripple={{ color: 'transparent' }}
                  onPress={() => {
                    setCurrentIndex(index);
                    setViewerVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: item, headers: { Authorization: `Bearer ${token}` } }}
                    style={styles.carouselImage}
                    contentFit="cover"
                  />
                </Pressable>
              )}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />

            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentIndex + 1}/{post.image_urls.length}
              </Text>
            </View>
          </View>
        )}

        {/* 正文 */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.tags}>#{post.poster_department} #{post.poster_campus}</Text>
          <Text style={styles.date}>{new Date(post.create_at).toLocaleDateString()}</Text>
        </View>
      </ScrollView>

      {/* 全屏预览；用 Image 渲染 */} 
      <ImageViewing
        images={viewingImages}
        imageIndex={currentIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        ImageComponent={Image as any}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: { paddingRight: 8, paddingVertical: 4 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  headerNickname: { flex: 1, fontSize: 15, fontWeight: '500', color: '#333' },
  headerFollowButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  headerFollowText: { fontSize: 13, color: '#ff4d4f', fontWeight: '500' },

  carouselWrapper: { width: screenWidth, height: screenWidth * 1.2, position: 'relative' },
  carouselImageWrapper: { width: screenWidth, height: screenWidth * 1.2 },
  carouselImage: { width: '100%', height: '100%' },

  pageIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pageText: { color: '#fff', fontSize: 13 },

  contentContainer: { paddingHorizontal: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2B333E', marginVertical: 12 },
  content: { fontSize: 16, lineHeight: 26, color: '#444', marginBottom: 16 },
  tags: { color: '#007aff', fontSize: 14, marginBottom: 12 },
  date: { fontSize: 12, color: '#aaa' },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
