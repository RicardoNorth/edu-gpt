import React, { useRef } from 'react';
import { FlatList, View, StyleSheet, Pressable, Dimensions } from 'react-native';
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
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) onVisibleIndexChange(viewableItems[0].index);
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: screenWidth, height: screenWidth * 1.2 },
  imageWrapper: { width: screenWidth, height: screenWidth * 1.2 },
  image: { width: '100%', height: '100%' },
});
