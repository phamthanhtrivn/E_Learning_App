import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import CourseCard from '../components/CourseCard';
import StarRating from '../components/StarRating';
import { useFetch } from '../hooks/useFetch';

type Review = {
  userId: { name: string; avatar: string };
  rating: number;
  comment: string;
  courseId: { title: string };
};

type Course = {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  lessons: number;
  thumbnail: string;
};

type Teacher = {
  name: string;
  job: string;
  location: string;
  courseCount: number;
  rating: number;
  reviewCount: number;
};

const TeacherProfile = () => {
  const { isLoading, error, get } = useFetch('http://localhost:7000');
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'review'>('overview');
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await get('/api/teachers/68ff183ab291d258b8876f40');
      setTeacherData(data.teacher);
      setSavedCourses(data.courses);
      setReviews(data.reviews || []);
    };
    fetchUser();
  }, []);
  const [activeRating, setActiveRating] = useState<'All' | number>('All');

  const filteredReviews =
    activeRating === 'All'
      ? reviews
      : reviews.filter((r) => r.rating === activeRating);

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );

  if (!teacherData)
    return (
      <View style={styles.center}>
        <Text>No teacher data</Text>
      </View>
    );

  const displayedCourses = showAllCourses ? savedCourses : savedCourses.slice(0, 5);

  // 👉 Trung bình rating của giáo viên
  const avgRating = teacherData.rating?.toFixed(1) || '0.0';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileHeader user={teacherData} />

        <View style={styles.coursesSection}>
          {/* Tabs */}
          <View style={styles.tabRow}>
            {['overview', 'courses', 'review'].map((tab) => (
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

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <View style={{ padding: 20 }}>
              <Text style={styles.overviewName}>{teacherData.name}</Text>
              <Text style={styles.overviewJob}>
                {teacherData.job || 'No job title provided'}
              </Text>

              <View style={styles.overviewInfoBox}>
                <Text style={styles.overviewLabel}>Location:</Text>
                <Text style={styles.overviewValue}>
                  {teacherData.location || 'Not specified'}
                </Text>
              </View>

              <Text style={styles.overviewStat}>
                Courses: {teacherData.courseCount}
              </Text>
              <Text style={styles.overviewStat}>
                Rating: {avgRating}
              </Text>
              <Text style={styles.overviewStat}>
                Reviews: {teacherData.reviewCount}
              </Text>

              <Text style={styles.overviewBio}>
                This instructor has not provided a bio yet. Stay tuned to learn more about their
                teaching style and expertise!
              </Text>
            </View>
          )}

          {/* Courses tab */}
          {activeTab === 'courses' && (
            <View>
              <View style={styles.courseHeader}>
                <View style={styles.rowCenter}>
                  <Text style={styles.sectionTitle}>Courses</Text>
                  <Text style={styles.topRatedBadge}>Top rated</Text>
                </View>

                <TouchableOpacity onPress={() => setShowAllCourses(!showAllCourses)}>
                  <Text style={styles.viewAllText}>
                    {showAllCourses ? 'Show less' : 'View all'}
                  </Text>
                </TouchableOpacity>
              </View>

              {displayedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  author={teacherData.name}
                  price={`$${course.price}`}
                  rating={course.rating}
                  totalReviews={course.reviewCount}
                  lessons={course.lessons}
                  image={course.thumbnail}
                  orientation="horizontal"
                />
              ))}
            </View>
          )}

          {/* Reviews tab */}
          {activeTab === 'review' && (
            <View style={styles.tabContent}>
              {/* Tổng quan đánh giá */}
              <View style={styles.ratingSummary}>
                <Text style={styles.ratingNumber}>{avgRating}/5</Text>
                <StarRating value={Number(avgRating)} />
                <Text style={styles.reviewCountText}>
                  ({teacherData.reviewCount} reviews)
                </Text>
              </View>

              {/* Bộ lọc số sao */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.ratingFilterContainer}
              >
                {['All', 5, 4, 3, 2, 1].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={[
                      styles.ratingFilterButton,
                      activeRating === star && styles.ratingFilterButtonActive,
                    ]}
                    onPress={() => setActiveRating(star as any)}
                  >
                    {star === 'All' ? (
                      <Text
                        style={[
                          styles.ratingFilterText,
                          activeRating === star && styles.ratingFilterTextActive,
                        ]}
                      >
                        All
                      </Text>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text
                          style={[
                            styles.ratingFilterText,
                            activeRating === star && styles.ratingFilterTextActive,
                          ]}
                        >
                          {star}
                        </Text>
                        <Text
                          style={[
                            styles.ratingFilterText,
                            activeRating === star && styles.ratingFilterTextActive,
                          ]}
                        >
                          ★
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Danh sách review sau khi lọc */}
              {filteredReviews.length === 0 ? (
                <Text style={styles.noReviewText}>No reviews found.</Text>
              ) : (
                filteredReviews.map((r, i) => (
                  <View key={i} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Image
                        source={{
                          uri:
                            r.userId?.avatar ||
                            'https://cdn-icons-png.flaticon.com/512/847/847969.png',
                        }}
                        style={styles.avatar}
                      />
                      <View>
                        <Text style={styles.reviewerName}>{r.userId?.name}</Text>
                        <StarRating value={r.rating} />
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{r.comment}</Text>
                    {r.courseId?.title && (
                      <Text style={styles.reviewCourse}>• Course: {r.courseId.title}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coursesSection: { paddingTop: 8, paddingBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  tabTextActive: { color: '#7c3aed' },

  overviewName: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6 },
  overviewJob: { fontSize: 16, color: '#6b7280', marginBottom: 12 },
  overviewInfoBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  overviewLabel: { fontWeight: '600', color: '#374151', marginRight: 6 },
  overviewValue: { color: '#4b5563' },
  overviewStat: { fontSize: 16, color: '#374151', marginBottom: 8 },
  overviewBio: { fontSize: 15, lineHeight: 22, color: '#374151', marginTop: 8 },

  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topRatedBadge: {
    color: 'white',
    backgroundColor: '#00AEEF',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },
  viewAllText: { color: '#00AEEF', fontSize: 16 },

  // 🔥 Reviews
  tabContent: { padding: 16 },
  ratingSummary: { flexDirection: 'row', gap: 10, alignItems: 'center', textAlign: 'center', marginBottom: 20 },
  ratingNumber: { fontSize: 28, fontWeight: '700', color: '#000' },
  reviewCountText: { color: '#6b7280', marginTop: 4 },
  noReviewText: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
  reviewItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  reviewerName: { fontSize: 15, fontWeight: '600', color: '#111' },
  reviewComment: { color: '#374151', fontSize: 14, marginBottom: 4 },
  reviewCourse: { fontSize: 12, color: '#6b7280' },
  ratingFilterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ratingFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  ratingFilterButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  ratingFilterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  ratingFilterTextActive: {
    color: '#fff',
  },

});

export default TeacherProfile;
