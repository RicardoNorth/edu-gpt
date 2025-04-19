import { FlatList, View, StyleSheet } from 'react-native'
import PostCard from '../components/PostCard'

const dummyPosts = [
  {
    id: '1',
    title: '第一次打球记',
    content: '今天第一次和朋友打羽毛球，发现比想象中有趣！',
    author: '小王',
    time: '2小时前',
  },
  {
    id: '2',
    title: '羽毛球拍推荐',
    content: '推荐大家试试 Yonex 的入门拍，性价比真的高。',
    author: '羽毛球小白',
    time: '1天前',
  },
]

export default function PostScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
})
