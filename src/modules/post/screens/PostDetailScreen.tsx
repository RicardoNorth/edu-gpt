import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ImageViewing from 'react-native-image-viewing';
import { usePostDetailStore } from '../store/postDetailStore';

const screenWidth = Dimensions.get('window').width;

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const post = usePostDetailStore((state) => state.currentPost);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>暂无内容</Text>
      </View>
    );
  }

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable
      onPress={() => {
        setCurrentIndex(index);
        setViewerVisible(true);
      }}
      android_ripple={{ color: 'transparent' }}
      style={styles.carouselImageWrapper}
    >
      <Image source={{ uri: item }} style={styles.carouselImage} />
    </Pressable>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 自定义导航栏 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>

        <Image source={post.avatar} style={styles.headerAvatar} />

        <Text style={styles.headerNickname} numberOfLines={1}>{post.nickname}</Text>

        <Pressable style={styles.headerFollowButton}>
          <Text style={styles.headerFollowText}>关注</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 图片轮播 */}
        {post.image && post.image.length > 0 && (
          <View style={styles.carouselWrapper}>
            <FlatList
              ref={flatListRef}
              data={post.image}
              renderItem={renderImageItem}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentIndex + 1}/{post.image.length}
              </Text>
            </View>
          </View>
        )}

        {/* 内容区域 */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{post.title}</Text>

          <Text style={styles.content}>{post.content}</Text>

          <Text style={styles.tags}>#学习 #AI写作 #ReactNative</Text>
          <Text style={styles.date}>2024-11-18</Text>
        </View>
      </ScrollView>

      {/* 大图缩放预览 */}
      <ImageViewing
        images={post.image?.map((uri) => ({ uri })) ?? []}
        imageIndex={currentIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  headerNickname: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  headerFollowButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  headerFollowText: {
    fontSize: 13,
    color: '#ff4d4f',
    fontWeight: '500',
  },
  carouselWrapper: {
    width: screenWidth,
    height: screenWidth * 1.2,
    position: 'relative',
  },
  carouselImageWrapper: {
    width: screenWidth,
    height: screenWidth * 1.2,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pageText: {
    color: '#fff',
    fontSize: 13,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B333E',
    marginVertical: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
    marginBottom: 16,
  },
  tags: {
    color: '#007aff',
    fontSize: 14,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
