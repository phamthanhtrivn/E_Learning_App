import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import CourseCard from "../components/CourseCard";
import StarRating from "../components/StarRating";
import { useFetch } from "../hooks/useFetch";
import { useNavigation, useRoute } from "@react-navigation/native";

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
  const route = useRoute();
  const { _id } = route.params as { _id: string };
  const { error, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);

  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "review">(
    "overview"
  );
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [activeRating, setActiveRating] = useState<"All" | number>("All");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await get(`/teachers/${_id}`);

        if (data) {
          setTeacherData(data.teacher || null);
          setSavedCourses(data.courses || []);
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error("Failed to fetch teacher:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [_id]);

  const filteredReviews =
    activeRating === "All"
      ? reviews
      : reviews.filter((r) => r.rating === activeRating);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );

  if (!teacherData)
    return (
      <View style={styles.center}>
        <Text>No teacher data found.</Text>
      </View>
    );

  const displayedCourses = showAllCourses
    ? savedCourses
    : savedCourses.slice(0, 5);

  const avgRating = teacherData.rating?.toFixed(1) || "0.0";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={teacherData} />

        <View style={styles.coursesSection}>
          {/* Tabs */}
          <View style={styles.tabRow}>
            {(["overview", "courses", "review"] as const).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
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

          {/* Overview */}
          {activeTab === "overview" && (
            <View style={{ padding: 20 }}>
              <Text style={styles.overviewName}>{teacherData.name}</Text>
              <Text style={styles.overviewJob}>
                {teacherData.job || "No job title provided"}
              </Text>

              <View style={styles.overviewInfoBox}>
                <Text style={styles.overviewLabel}>Location:</Text>
                <Text style={styles.overviewValue}>
                  {teacherData.location || "Not specified"}
                </Text>
              </View>

              <Text style={styles.overviewStat}>
                Courses: {teacherData.courseCount}
              </Text>
              <Text style={styles.overviewStat}>Rating: {avgRating}</Text>
              <Text style={styles.overviewStat}>
                Reviews: {teacherData.reviewCount}
              </Text>

              <Text style={styles.overviewBio}>
                This instructor has not provided a bio yet. Stay tuned to learn
                more about their teaching style and expertise!
              </Text>
            </View>
          )}

          {/* Courses */}
          {activeTab === "courses" && (
            <View>
              <View style={styles.courseHeader}>
                <View style={styles.rowCenter}>
                  <Text style={styles.sectionTitle}>Courses</Text>
                  <Text style={styles.topRatedBadge}>Top rated</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowAllCourses(!showAllCourses)}
                >
                  <Text style={styles.viewAllText}>
                    {showAllCourses ? "Show less" : "View all"}
                  </Text>
                </TouchableOpacity>
              </View>

              {displayedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  price={course.price}
                  rating={course.rating}
                  reviewCount={course.reviewCount}
                  lessonCount={course.lessons}
                  thumbnail={course.thumbnail}
                  orientation="horizontal"
                />
              ))}
            </View>
          )}

          {/* Reviews */}
          {activeTab === "review" && (
            <View style={styles.tabContent}>
              <View style={styles.ratingSummary}>
                <Text style={styles.ratingNumber}>{avgRating}/5</Text>
                <StarRating value={Number(avgRating)} />
                <Text style={styles.reviewCountText}>
                  ({teacherData.reviewCount} reviews)
                </Text>
              </View>

              {/* Filter */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.ratingFilterContainer}
              >
                {(["All", 5, 4, 3, 2, 1] as const).map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={[
                      styles.ratingFilterButton,
                      activeRating === star && styles.ratingFilterButtonActive,
                    ]}
                    onPress={() => setActiveRating(star)}
                  >
                    {star === "All" ? (
                      <Text
                        style={[
                          styles.ratingFilterText,
                          activeRating === star &&
                            styles.ratingFilterTextActive,
                        ]}
                      >
                        All
                      </Text>
                    ) : (
                      <View style={{ flexDirection: "row", gap: 4 }}>
                        <Text
                          style={[
                            styles.ratingFilterText,
                            activeRating === star &&
                              styles.ratingFilterTextActive,
                          ]}
                        >
                          {star} ★
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Reviews */}
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
                            "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                        }}
                        style={styles.avatar}
                      />
                      <View>
                        <Text style={styles.reviewerName}>
                          {r.userId?.name}
                        </Text>
                        <StarRating value={r.rating} />
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{r.comment}</Text>
                    {r.courseId?.title && (
                      <Text style={styles.reviewCourse}>
                        • Course: {r.courseId.title}
                      </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  coursesSection: { paddingTop: 8, paddingBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  tabText: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  tabTextActive: { color: "#7c3aed" },
  overviewName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  overviewJob: { fontSize: 16, color: "#6b7280", marginBottom: 12 },
  overviewInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  overviewLabel: { fontWeight: "600", color: "#374151", marginRight: 6 },
  overviewValue: { color: "#4b5563" },
  overviewStat: { fontSize: 16, color: "#374151", marginBottom: 8 },
  overviewBio: { fontSize: 15, lineHeight: 22, color: "#374151", marginTop: 8 },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 10 },
  topRatedBadge: {
    color: "white",
    backgroundColor: "#00AEEF",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },
  viewAllText: { color: "#00AEEF", fontSize: 16 },
  tabContent: { padding: 16 },
  ratingSummary: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  ratingNumber: { fontSize: 28, fontWeight: "700", color: "#000" },
  reviewCountText: { color: "#6b7280", marginTop: 4 },
  noReviewText: { textAlign: "center", color: "#6b7280", marginTop: 20 },
  reviewItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  reviewerName: { fontSize: 15, fontWeight: "600", color: "#111" },
  reviewComment: { color: "#374151", fontSize: 14, marginBottom: 4 },
  reviewCourse: { fontSize: 12, color: "#6b7280" },
  ratingFilterContainer: { flexDirection: "row", marginBottom: 16 },
  ratingFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  ratingFilterButtonActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#7c3aed",
  },
  ratingFilterText: { fontSize: 14, color: "#374151", fontWeight: "500" },
  ratingFilterTextActive: { color: "#fff" },
});

export default TeacherProfile;
