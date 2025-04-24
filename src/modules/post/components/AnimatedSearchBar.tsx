import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const placeholderList = [
  '搜索帖子',
  '你想了解什么？',
  '输入关键词试试',
  '找找有没有感兴趣的话题',
];

interface AnimatedSearchBarProps extends TextInputProps {}

export default function AnimatedSearchBar(props: AnimatedSearchBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderList.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#999" style={styles.icon} />
      <TextInput
        {...props}
        style={styles.input}
        placeholder={placeholderList[placeholderIndex]}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
