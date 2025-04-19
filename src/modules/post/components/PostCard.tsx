import { View, Text, StyleSheet } from 'react-native'

interface Post {
  id: string
  title: string
  content: string
  author: string
  time: string
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.meta}>
        <Text style={styles.author}>{post.author}</Text>
        <Text style={styles.time}>{post.time}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#aaa',
  },
})
