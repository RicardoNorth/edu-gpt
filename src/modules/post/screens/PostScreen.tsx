// src/modules/post/screens/PostScreen.tsx
import { View, Text, StyleSheet } from 'react-native'

export default function PostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>这是发帖页面</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
})
