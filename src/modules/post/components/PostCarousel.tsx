import React, { useRef } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Text,
} from 'react-native';
import { Image } from 'expo-image';

const screenWidth = Dimensions.get('window').width;

interface Props {
  imageUrls: string[];
  onImagePress: (index: number) => void;
  onVisibleIndexChange: (index: number) => void;
}

export default function PostCarousel({
  imageUrls,
  onImagePress,
  onVisibleIndexChange,
}: Props) {
  const visibleIndexRef = useRef(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const idx = viewableItems[0].index ?? 0;
      visibleIndexRef.current = idx;
      onVisibleIndexChange(idx);
    }
  }).current;

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={imageUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.imageWrapper}
            android_ripple={{ color: 'transparent' }}
            onPress={() => onImagePress(index)}
          >
            <Image source={{ uri: item }} style={styles.image} contentFit="cover" />
          </Pressable>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.pageIndicator}>
        <Text style={styles.pageText}>
          {visibleIndexRef.current + 1}/{imageUrls.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: screenWidth, height: screenWidth * 1.2 },
  imageWrapper: { width: screenWidth, height: screenWidth * 1.2 },
  image: { width: '100%', height: '100%' },

  /* 绝对定位的页码 */
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
});
