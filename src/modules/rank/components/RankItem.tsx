import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RankItemProps {
  index: number;
  title: string;
  comment: string;
  score: number;
  count: number;
}

export default function RankItem({ index, title, comment, score, count }: RankItemProps) {
  return (
    <View style={styles.container}>
      {/* 排名 */}
      <View style={styles.rankBox}>
        <Text style={styles.index}>{index}</Text>
      </View>

      {/* 头像占位 */}
      <View style={styles.avatar} />

      {/* 中间内容 */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.commentBox}>
          <Text
            style={styles.comment}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {comment}
          </Text>
        </View>

      </View>

      {/* 分数 */}
      <View style={styles.scoreBox}>
        <Text style={styles.score}>{score.toFixed(1)}</Text>
        <Text style={styles.count}>{count}位同学评分</Text>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  rankBox: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  index: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00cfcf',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentBox: {
    backgroundColor: '#ccfcff',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  comment: {
    color: '#00cfcf',
    fontSize: 12,
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00cfcf',
    marginLeft: 8,
  },
  count: {
    fontSize: 12,
    color: '#888',
  },
  scoreBox: {
    alignItems: 'flex-end',
  },
});
