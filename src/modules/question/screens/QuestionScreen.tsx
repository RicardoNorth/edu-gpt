import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';


const mockCourses = [
  {
    id: '1',
    title: '电子商务概论',
    college: '管理学院',
    type: '专业必修课',
    tags: ['互联网', '金融', '计算机'],
    image: require('../../../../assets/course-cover.jpg'), // 换成你本地的图
    students: 128,
    likes: 43,
    comments: 12,
  },
  {
    id: '2',
    title: '电子商务概论',
    college: '管理学院',
    type: '专业必修课',
    tags: ['互联网', '金融', '计算机'],
    image: require('../../../../assets/course-cover.jpg'), // 换成你本地的图
    students: 128,
    likes: 43,
    comments: 12,
  },
  {
    id: '3',
    title: '电子商务概论',
    college: '管理学院',
    type: '专业必修课',
    tags: ['互联网', '金融', '计算机'],
    image: require('../../../../assets/course-cover.jpg'), // 换成你本地的图
    students: 128,
    likes: 43,
    comments: 12,
  },
  {
    id: '4',
    title: '电子商务概论',
    college: '管理学院',
    type: '专业必修课',
    tags: ['互联网', '金融', '计算机'],
    image: require('../../../../assets/course-cover.jpg'), // 换成你本地的图
    students: 128,
    likes: 43,
    comments: 12,
  },
  {
    id: '5',
    title: '电子商务概论',
    college: '管理学院',
    type: '专业必修课',
    tags: ['互联网', '金融', '计算机'],
    image: require('../../../../assets/course-cover.jpg'), // 换成你本地的图
    students: 128,
    likes: 43,
    comments: 12,
  },
  {
    id: '6',
    title: '电子商务概论',
    college: '管理学院',
    type: '专业必修课',
    tags: ['互联网', '金融', '计算机'],
    image: require('../../../../assets/course-cover.jpg'), // 换成你本地的图
    students: 128,
    likes: 43,
    comments: 12,
  },
];

const screenWidth = Dimensions.get('window').width;

export default function QuestionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const renderCourseCard = ({ item }: { item: typeof mockCourses[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate('CourseDetail', { courseId: item.id });
      }}
    >
      <Image source={item.image} style={styles.courseImage} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.college}　{item.type}</Text>
        <View style={styles.tagRow}>
          {item.tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.meta}>
          {item.students}人已学完　{item.likes}人点赞　{item.comments}人评论
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <TextInput style={styles.searchInput} placeholder="搜索课程" />
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadText}>上传资料</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>推荐课程</Text>

        <FlatList
          data={mockCourses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  uploadButton: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  courseImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
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
  meta: {
    fontSize: 12,
    color: '#999',
  },
});
