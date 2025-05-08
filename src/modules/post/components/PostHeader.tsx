import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

interface Props {
  nickname: string;
  avatarUrl: string;
  token: string;
}

export default function PostHeader({ nickname, avatarUrl, token }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Pressable>

      <Image
        source={{
          uri: avatarUrl,
          headers: { Authorization: `Bearer ${token}` },
        }}
        style={styles.headerAvatar}
        contentFit="cover"
      />

      <Text style={styles.headerNickname} numberOfLines={1}>
        {nickname}
      </Text>

      <Pressable style={styles.headerFollowButton}>
        <Text style={styles.headerFollowText}>关注</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
