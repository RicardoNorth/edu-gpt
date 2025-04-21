import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const recommendedUsers = [
  { id: 2, avatar: null, nickname: '羽协第一深情' },
  { id: 3, avatar: null, nickname: '望水' },
  { id: 4, avatar: null, nickname: '不知名球友123' },
];

export default function RecommendedUserList() {
  return (
    <View style={styles.recommendSection}>
      <Text style={styles.recommendTitle}>你可能感兴趣的人</Text>
      {recommendedUsers.map((item) => (
        <View key={item.id} style={styles.recommendCard}>
          <View style={styles.recommendAvatar}><Text style={{ fontSize: 20 }}>🙂</Text></View>
          <Text style={styles.recommendNickname}>{item.nickname}</Text>
          <TouchableOpacity style={styles.followButton}><Text style={styles.followText}>关注</Text></TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  recommendSection: { width: '95%', maxWidth: 480, alignSelf: 'center' },
  recommendTitle: { fontSize: 18, fontWeight: 'bold', color: '#2B333E', marginBottom: 12 },
  recommendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  recommendAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  recommendNickname: { flex: 1, fontSize: 16, color: '#2B333E' },
  followButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#2B333E', borderRadius: 16 },
  followText: { color: '#fff', fontSize: 14 },
});
