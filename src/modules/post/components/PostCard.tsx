import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePostDetailStore } from '../store/postDetailStore';
import { RootStackParamList } from '../../../navigation/RootNavigator'; // ✅ 根据实际路径调整

interface PostCardProps {
  avatar: any;
  nickname: string;
  title: string;
  preview: string;
  likes: number;
  saves: number;
  onPress?: () => void;
}


type Navigation = NativeStackNavigationProp<RootStackParamList, 'MainApp'>;

export default function PostCard({
  avatar,
  nickname,
  title,
  preview,
  likes,
  saves,
}: PostCardProps) {
  const navigation = useNavigation<Navigation>();
  const { setCurrentPost } = usePostDetailStore();

  const handlePress = () => {
    setCurrentPost({
      id: Math.random().toString(),
      nickname,
      avatar,
      title,
      content:
        '这是帖子全文内容，可以从接口获取并支持换行展示。\n\n支持多段文字、代码、图片等丰富展示。',
      likes,
      saves,
    });

    navigation.navigate('PostDetailScreen'); // ✅ 现在不会报错了
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.nickname}>{nickname}</Text>
      </View>
      <Text style={styles.preview}>{preview}</Text>
      <View style={styles.stats}>
        <Text style={styles.statText}>👍 {likes}</Text>
        <Text style={styles.statText}>⭐ {saves}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B333E',
    marginBottom: 4,
  },
  preview: {
    fontSize: 15,
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
