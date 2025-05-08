import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  content: string;
  department: string;
  campus: string;
  createdAt: string;
}

export default function PostContent({ title, content, department, campus, createdAt }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.tags}>#{department} #{campus}</Text>
      <Text style={styles.date}>{new Date(createdAt).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2B333E', marginVertical: 12 },
  content: { fontSize: 16, lineHeight: 26, color: '#444', marginBottom: 16 },
  tags: { color: '#007aff', fontSize: 14, marginBottom: 12 },
  date: { fontSize: 12, color: '#aaa' },
});
