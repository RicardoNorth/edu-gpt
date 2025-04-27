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
    image: require('../store/images/1.png'), // 换成你本地的图
    students: 128,
    likes: 43,
    comments: 12,
  },
  {    
    id: '2',
    title: '运筹学',
    college: '管理学院',
    type: '专业必修课',
    tags: ['统计', '数学建模', '优化决策'],
    image: require('../store/images/2.jpg'),
    students: 215,
    likes: 78,
    comments: 25,
  },
  {
    id: '3',
    title: '经济学',
    college: '管理学院',
    type: '专业必修课',
    tags: ['宏观经济', '微观经济', '货币'],
    image: require('../store/images/3.png'),
    students: 195,
    likes: 56,
    comments: 18,
  },
  {
    id: '4',
    title: '离散数学',
    college: '管理学院',
    type: '专业必修课',
    tags: ['逻辑推理', '算法基础', '离散结构'],
    image: require('../store/images/4.png'),
    students: 156,
    likes: 32,
    comments: 9,
  },
  {
    id: '5',
    title: '数据结构',
    college: '管理学院',
    type: '专业选修课',
    tags: ['算法设计', '数据结构', '编程基础'],
    image: require('../store/images/5.png'),
    students: 110,
    likes: 65,
    comments: 21,
  },
  {
    id: '6',
    title: '数据库原理与应用',
    college: '管理学院',
    type: '专业必修课',
    tags: ['数据库', '信息系统', 'SQL查询'],
    image: require('../store/images/6.png'),
    students: 88,
    likes: 44,
    comments: 14,
  },
  {
    id: '7',
    title: '社交网络分析',
    college: '管理学院',
    type: '专业选修课',
    tags: ['网络媒体', '数据分析', '用户行为'],
    image: require('../store/images/7.png'),
    students: 89,
    likes: 27,
    comments: 9,
  },
  {
    id: '8',
    title: '个性化推荐',
    college: '管理学院',
    type: '专业选修课',
    tags: ['推荐算法', '机器学习', '用户画像'],
    image: require('../store/images/8.png'),
    students: 65,
    likes: 28,
    comments: 7,
  },
  {
    id: '9',
    title: '大数据挖掘方法',
    college: '管理学院',
    type: '专业必修课',
    tags: ['机器学习', '数据挖掘', '商务智能'],
    image: require('../store/images/9.png'),
    students: 120,
    likes: 72,
    comments: 19,
  },
  {
    id: '10',
    title: '物流与供应链管理',
    college: '管理学院',
    type: '专业选修课',
    tags: ['供应链优化', '物流规划', '运营管理'],
    image: require('../store/images/10.png'),
    students: 80,
    likes: 38,
    comments: 11,
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
