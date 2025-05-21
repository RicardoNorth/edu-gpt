import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useAuthStore } from '../../auth/store';

export interface Reply {
  id: number;
  poster_id: number;
  poster_nickname: string;
  avatar_url: string;
  content: string;
  create_at: string;
  reply: number;
}

interface Props {
  commentId: number;
  reply: Reply;
  replyToNick: string;
  onReplyIntent: (ctx: {
    parent: number;
    reply: number;
    nick: string;
  }) => void;
}

export default function ReplyItem({
  commentId,
  reply,
  replyToNick,
  onReplyIntent,
}: Props) {
  const token = useAuthStore((s) => s.token);
  const avatarSrc = `${reply.avatar_url}?v=${Date.now()}`;

  return (
    <View style={styles.row}>
      <Image
        source={{
          uri: avatarSrc,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.nick}>{reply.poster_nickname}</Text>
        <Text style={styles.content}>
          {`回复 @${replyToNick}：${reply.content}`}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.date}>{reply.create_at.slice(0, 10)}</Text>
          <Pressable
            hitSlop={4}
            onPress={() =>
              onReplyIntent({
                parent: commentId,
                reply: reply.poster_id,
                nick: reply.poster_nickname,
              })
            }
          >
            <Text style={styles.replyBtn}>回复</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  nick: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#111',
    marginVertical: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: '#888',
  },
  replyBtn: {
    marginLeft: 12,
    fontSize: 12,
    color: '#007aff',
  },
});
