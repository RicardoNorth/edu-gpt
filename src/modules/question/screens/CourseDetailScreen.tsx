import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { PersonSimpleWalk } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

const mockCourseDetail = {
  id: '1',
  title: '电子商务概论',
  author: '管理学院',
  tags: ['互联网', '金融', '计算机'],
  image: require('../store/images/1.png'),
  students: 128000,
  likes: 4300,
  comments: 1200,
  description:
    '这是一门介绍电子商务基本概念、发展历史、主要模式与平台的课程，帮助你全面了解电商运营。',
  rating: 73.5,
  reviews: [
    {
      user: '人生海海',
      content:
        '好课，好题',
      likes: 3677,
      comments: 180,
    },
  ],
};

export default function CourseDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { courseId } = route.params as { courseId: string };

  return (
    <LinearGradient
      colors={['#c4d7d6', 'white']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={[styles.customBackBtn, { top: insets.top }]} onPress={() => navigation.goBack()}>
          <View style={styles.arrowContainer}>
            <ArrowLeft color="#fff" size={26} />
          </View>
          <View style={styles.separator} />
          <View style={styles.walkerContainer}>
            <PersonSimpleWalk size={26} color="#fff" weight="fill" style={{ transform: [{ scaleX: -1 }] }} />
          </View>
        </TouchableOpacity>

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingTop: insets.top }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Image source={mockCourseDetail.image} style={styles.coverImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{mockCourseDetail.title}</Text>
              <Text style={styles.author}>{mockCourseDetail.author}</Text>
              <View style={styles.tagRow}>
                {mockCourseDetail.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.description}>{mockCourseDetail.description}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{(mockCourseDetail.students / 10000).toFixed(1)} 万人</Text>
              <Text style={styles.metricLabel}>学习人数</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{(mockCourseDetail.likes / 1000).toFixed(1)} K</Text>
              <Text style={styles.metricLabel}>点赞</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{mockCourseDetail.comments}</Text>
              <Text style={styles.metricLabel}>评论</Text>
            </View>
          </View>

          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>推荐指数 {mockCourseDetail.rating}%</Text>
            <View style={styles.ratingBar}>
              <View style={[styles.ratingFill, { width: `${mockCourseDetail.rating}%` }]} />
            </View>
            <View style={styles.bottomButtonRow}>
            {/* <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>加入题库</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>开始做题</Text>
            </TouchableOpacity>
          </View>
            <View style={styles.tagRow}>
              {['值得一学', '通俗易懂', '适合新手'].map((tag, i) => (
                <View key={i} style={styles.ratingTag}>
                  <Text style={styles.ratingTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {mockCourseDetail.reviews.map((review, idx) => (
            <View key={idx} style={styles.reviewCard}>
              <Text style={styles.reviewer}>{review.user} 推荐</Text>
              <Text style={styles.reviewText}>{review.content}</Text>
              <View style={styles.reviewMeta}>
                <Text>👍 {review.likes}</Text>
                <Text>💬 {review.comments}</Text>
              </View>
            </View>
          ))}

          
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  customBackBtn: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    backgroundColor: '#0DC646',
    borderRadius: 6,
    paddingHorizontal: 2,
    paddingVertical: 6,
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  arrowContainer: {
    paddingHorizontal: 2,
  },
  separator: {
    width: 2,
    height: '100%',
    backgroundColor: 'white',
    marginLeft: 10,
  },
  walkerContainer: {
    paddingRight: 6,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  coverImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e6f0ff',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#007bff',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  ratingFill: {
    height: 8,
    backgroundColor: '#4caf50',
  },
  ratingTag: {
    backgroundColor: '#d2f0e6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  ratingTagText: {
    fontSize: 12,
    color: '#2e7d32',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  reviewer: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#666',
  },
  bottomButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#eee',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
  },
});
