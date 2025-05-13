import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RankItem from '../components/RankItem';

const tabOptions = ['专业榜', '公选课', '美食榜'];

export default function RankScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('专业榜');

  const data = [
    {
      title: '大数据管理与应用',
      comment: '李比多326：还以为是在计算机学院',
      score: 9.0,
      count: 273,
    },
    {
      title: '信息与计算科学',
      comment: '小委：专业课老师比较开明',
      score: 8.8,
      count: 233,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 顶部 tab 切换 */}
      <View style={styles.tabBar}>
        {tabOptions.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </Pressable>
        ))}
        <Pressable style={{ marginLeft: 'auto' }}>
          <Text style={styles.allRank}>全部榜单</Text>
        </Pressable>
      </View>

      {/* 榜单列表 */}
      <FlatList
        data={data}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <RankItem
            index={index + 1}
            title={item.title}
            comment={item.comment}
            score={item.score}
            count={item.count}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  tabText: {
    marginRight: 16,
    fontSize: 16,
    color: '#999',
  },
  activeTab: {
    color: '#00cfcf',
    fontWeight: 'bold',
  },
  allRank: {
    fontSize: 14,
    color: '#666',
  },
});
