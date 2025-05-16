import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageViewing from 'react-native-image-viewing';
import { useRoute } from '@react-navigation/native';
import { useAuthStore } from '../../auth/store';

import PostHeader from '../components/PostHeader';
import PostCarousel from '../components/PostCarousel';
import PostContent from '../components/PostContent';
import BottomActionBar from '../components/BottomActionBar';

export default function PostDetailScreen() {
  const route = useRoute();
  const { id } = route.params as { id: number };

  const token = useAuthStore((s) => s.token);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [base64Images, setBase64Images] = useState<string[]>([]);

  const fetchBlobAndConvertToBase64 = async (url: string, token: string) => {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error('图片加载失败', err);
      return null;
    }
  };

  const fetchPostDetail = async () => {
    try {
      if (!token) return;

      const res = await fetch(`https://remote.xiaoen.xyz/api/v1/post/auth/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (json.code === 10000) {
        const data = json.data;
        console.log('📦 帖子详情接口返回数据:', data);
        data.is_liked = Number(data.like_status ?? 0);
        data.content = data.content.replace(/\\n/g, '\n');
        setPost(data);

        if (data.image_urls?.length > 0) {
          const results = await Promise.all(
            data.image_urls.map((url: string) =>
              fetchBlobAndConvertToBase64(url, token)
            )
          );
          setBase64Images(results.filter(Boolean) as string[]);
        }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <PostHeader
        nickname={post.poster_nickname}
        avatarUrl={post.avatar}
        token={token!}
      />


      <ScrollView showsVerticalScrollIndicator={false}>
        {base64Images.length > 0 && (
          <>
            <PostCarousel
              imageUrls={base64Images}
              onImagePress={(index) => {
                setCurrentIndex(index);
                setViewerVisible(true);
              }}
              onVisibleIndexChange={(index) => setCurrentIndex(index)}
            />
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentIndex + 1}/{base64Images.length}
              </Text>
            </View>
          </>
        )}

        <PostContent
          title={post.title}
          content={post.content}
          department={post.poster_department}
          campus={post.poster_campus}
          createdAt={post.create_at}
        />
      </ScrollView>

      <ImageViewing
        images={base64Images.map((uri) => ({ uri }))}
        imageIndex={currentIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />

      <BottomActionBar
        key={`like-bar-${post.is_liked}`}
        postId={post.id}
        initialLiked={String(post.is_liked) === '1'}
        onLikeStatusChange={(status) =>
          setPost((prev: any) => ({ ...prev, is_liked: status ? 1 : 0 }))
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
