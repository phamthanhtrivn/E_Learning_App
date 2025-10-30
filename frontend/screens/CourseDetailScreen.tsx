import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useFetch } from '../hooks/useFetch';
import CourseCard from '../components/CourseCard';
import StarRating from '../components/StarRating';
import LessonRow from '../components/LessonRow';
import SectionAccordion from '../components/SectionAccordion';
import ReviewItem from '../components/ReviewItem';
type Lesson = { title: string; duration: string; isLocked: boolean };
type Section = { title: string; order: number; lessons: Lesson[] };
type Review = { userId: { name: string, avatar: string }; rating: number; comment: string };
type Teacher = { _id: string; name: string; job: string; profilePicture: string };

type Course = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  lessons: number;
  benefits: string[];
  sections: Section[];
  teacherId: Teacher;
};

type CourseResponse = {
  course: Course;
  reviews: Review[];
  questions: any[];
};

export default function CourseDetailScreen() {
  const { isLoading, error, get } = useFetch('http://localhost:7000');
  const [data, setData] = useState<CourseResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'review'>('overview');
  const [courseCategory, setCourseCategory] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await get('/api/courses/68ff183bb291d258b8876f58');
      setData(res);
      setCourse(res.course);
      setTeacher(res.course.teacherId);
      setReviews(res.reviews);
      setCourseCategory(res.courseCategory || []);

    };
    fetchData();
  }, []);
  const [selectedRating, setSelectedRating] = useState<number | "All">("All");

  const filteredReviews = useMemo(() => {
    if (selectedRating === "All") return reviews;
    return reviews.filter(r => r.rating === selectedRating);
  }, [reviews, selectedRating]);

  // const course = data?.course;
  // const teacher = course?.teacherId;
  // const reviews = data?.reviews || [];
  const priceText = useMemo(() => `$${course?.price}`, [course?.price]);
  // const courseCategory = data?.courseCategory || [];
  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  if (error) return <Text>Error: {error}</Text>;
  if (!course) return <Text>No course found</Text>;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Feather name="chevron-left" size={24} color="#000" />
          <Text style={styles.headerTitle}>Course details</Text>
          <Feather name="bookmark" size={22} color="#000" />
        </View>

        {/* Hero */}
        <View style={styles.heroContainer}>
          {/* <Text style={styles.heroText}>{course.thumbnail}</Text> */}
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
          />
          <TouchableOpacity style={styles.playButton}>
            <Feather name="play" size={20} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {['overview', 'lessons', 'review'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Teacher */}
            <View style={styles.teacherCard}>
              <Image
                source={{ uri: teacher?.profilePicture }}
                style={styles.teacherAvatar}
              />
              <View>
                <Text style={styles.teacherName}>{teacher?.name}</Text>
                <Text style={styles.teacherJob}>{teacher?.job}</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.description}>{course.description}</Text>

            {/* Benefits */}
            <Text style={styles.sectionHeading}>Benefits</Text>
            {course.benefits.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Feather name="check" size={16} color="#7c3aed" />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
            <View style={styles.coursesSection}>
              <Text style={styles.sectionTitle}>Similar courses</Text>

              {courseCategory.map((course: Course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  author={course.teacherId.name}
                  price={`$${course.price}`}
                  rating={course.rating}
                  totalReviews={course.reviews}
                  lessons={course.lessons}
                  image={course.thumbnail}
                  orientation="horizontal"
                />
              ))}
            </View>
          </View>


        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <View style={styles.tabContent}>
            {course.sections.map((s, i) => (
              <SectionAccordion key={i} section={s} />
            ))}
          </View>
        )}

        {/* Review Tab */}
        {activeTab === 'review' && (
          <View style={styles.tabContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.ratingText}>{course.rating}/5</Text>
              <StarRating value={course.rating} />
            </View>

            {/* Bộ lọc theo số sao */}
            <View style={styles.filterRow}>
              {["All", 5, 4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.filterButton,
                    selectedRating === rating && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedRating(rating as number | "All")}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedRating === rating && styles.filterTextActive,
                    ]}
                  >
                    {rating === "All" ? "All" : `${rating} ⭐`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Danh sách review */}
            {filteredReviews.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 10 }}>No reviews found</Text>
            ) : (
              filteredReviews.map((r, i) => <ReviewItem key={i} review={r} />)
            )}
          </View>
        )}

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.discount}>80% Disc. 1020$</Text>
          <Text style={styles.price}>{priceText}</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  heroContainer: {
    height: 300,
    // backgroundColor: '#7c3aed',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  heroText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  playButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  tabTextActive: { color: '#7c3aed' },
  tabContent: { padding: 16 },
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  teacherAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  teacherName: { fontSize: 14, fontWeight: '600' },
  teacherJob: { fontSize: 12, color: '#888' },
  followBtn: {
    marginLeft: 'auto',
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  followText: { color: '#fff', fontSize: 12 },
  sectionHeading: { fontSize: 14, fontWeight: '700', marginTop: 12 },
  description: { fontSize: 13, color: '#555', marginTop: 4 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  benefitText: { marginLeft: 8, fontSize: 13, color: '#333' },
  lessonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  lessonIndex: { width: 30, color: '#888', fontSize: 12 },
  lessonTitle: { fontSize: 13, fontWeight: '500' },
  lessonDuration: { fontSize: 11, color: '#666', marginLeft: 4 },
  sectionContainer: { marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  sectionTitle: { fontWeight: '600', color: '#000' },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  coursesSection: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  reviewUser: { fontSize: 13, fontWeight: '600', color: '#000' },
  reviewComment: { fontSize: 13, color: '#555', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingText: { fontSize: 20, fontWeight: '700', color: '#000' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    backgroundColor: '#fff',
  },
  discount: { fontSize: 11, color: '#888' },
  price: { fontSize: 18, fontWeight: '700', color: '#000' },
  cartBtn: {
    backgroundColor: '#7c3aed',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  cartText: { color: '#fff', fontWeight: '600' },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  filterText: {
    fontSize: 13,
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

});
