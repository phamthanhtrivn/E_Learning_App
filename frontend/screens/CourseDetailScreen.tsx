"use client";

import { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFetch } from "../hooks/useFetch";
import { useRoute, useNavigation } from "@react-navigation/native";
import CourseCard from "../components/CourseCard";
import SectionAccordion from "../components/SectionAccordion";
import ReviewItem from "../components/ReviewItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lesson } from "../types/Types";
import { Section } from "../types/Types";
import { Review } from "../types/Types";
import { Teacher } from "../types/Types";
import { Course } from "../types/Types";
import { useAuth } from "../contexts/AuthContext";
type CourseResponse = {
  course: Course;
  reviews: Review[];
  questions: any[];
  courseCategory?: Course[];
};

export default function CourseDetailScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { _id } = route.params as { _id: string };

  const { isLoading, error, get, post } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [course, setCourse] = useState<Course | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courseCategory, setCourseCategory] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "review">(
    "overview"
  );
  const [selectedRating, setSelectedRating] = useState<number | "All">("All");
  const [isInCart, setIsInCart] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: CourseResponse = await get(`/courses/${_id}`);
        if (res) {
          setCourse(res.course);
          const teacherData =
            typeof res.course.teacherId === "object"
              ? res.course.teacherId
              : null
          setTeacher(teacherData);
          setReviews(res.reviews || []);
          setCourseCategory(res.courseCategory || []);
        }
      } catch (err) {
        console.error("Error fetching course detail:", err);
      }
    };
    fetchData();
  }, [_id]);
  const addCart = async () => {
    if (!user?._id || !course?._id) return;
    setAdding(true);

    try {
      const res = await post("/users/cart", { userId: user._id, courseId: course._id });
      if (!res) return;

      alert(res.alreadyInCart ? "Course already in cart" : "Course added to cart!");
      setIsInCart(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setAdding(false);
    }
  };


  const filteredReviews = useMemo(() => {
    if (selectedRating === "All") return reviews;
    return reviews.filter((r) => r.rating === selectedRating);
  }, [reviews, selectedRating]);

  const priceText = useMemo(() => `$${course?.price}`, [course?.price]);

  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  if (error) return <Text>Error: {error}</Text>;
  if (!course) return <Text>No course found</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Course details</Text>
          <Feather name="bookmark" size={22} color="#000" />
        </View>

        <View style={styles.heroContainer}>
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
          <TouchableOpacity style={styles.playButton}>
            <Feather name="play" size={20} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        <View style={styles.courseTitleSection}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.courseMetaRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingValue}>
                {course.rating} ({course.reviewCount})
              </Text>
            </View>
            <Text style={styles.lessonCount}>{course.lessonCount} lessons</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          {["overview", "lessons", "review"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "overview" && (
          <View style={styles.tabContent}>
            <View style={styles.teacherCard}>
              <Image
                source={{ uri: teacher?.profilePicture }}
                style={styles.teacherAvatar}
              />
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>{teacher?.name}</Text>
                <Text style={styles.teacherJob}>{teacher?.job}</Text>
              </View>
            </View>

            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.description}>{course.description}</Text>

            <Text style={styles.sectionHeading}>Benefits</Text>
            {course.benefits.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Feather name="check" size={18} color="#06b6d4" />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}

            {courseCategory.length > 0 && (
              <View style={styles.coursesSection}>
                <Text style={styles.sectionHeading}>Similar courses</Text>
                {courseCategory.map((c) => (
                  <CourseCard
                    key={c._id}
                    _id={c._id}
                    title={c.title}
                    price={c.price}
                    rating={c.rating}
                    reviewCount={c.reviewCount}
                    lessonCount={c.lessonCount}
                    thumbnail={c.thumbnail}
                    orientation="horizontal"
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "lessons" && (
          <View style={styles.tabContent}>
            {course.sections.map((s, i) => (
              <SectionAccordion key={i} section={s} />
            ))}
          </View>
        )}

        {activeTab === "review" && (
          <View style={styles.tabContent}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.ratingNumber}>{course.rating}/5</Text>
                <Text style={styles.reviewCount}>
                  ({course.reviewCount} reviews)
                </Text>
              </View>
              <Text style={styles.viewAll}>View all</Text>
            </View>

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

            {filteredReviews.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                No reviews found
              </Text>
            ) : (
              filteredReviews.map((r, i) => <ReviewItem key={i} review={r} />)
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>{priceText}</Text>
        </View>
        <TouchableOpacity onPress={addCart} style={styles.cartBtn} disabled={adding}>
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="shopping-cart" size={16} color="#fff" />
              <Text style={styles.cartText}>Buy</Text>
            </>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  heroContainer: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
    marginTop: 20,
  },
  playButton: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -25,
    marginTop: -25,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  courseTitleSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  courseMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    fontSize: 14,
    color: "#fbbf24",
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  lessonCount: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: "#06b6d4",
    fontWeight: "700",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 3,
    backgroundColor: "#06b6d4",
    borderRadius: 1.5,
  },
  tabContent: { padding: 16, paddingTop: 12 },
  teacherCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  teacherAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  teacherInfo: { flex: 1 },
  teacherName: { fontSize: 14, fontWeight: "600", color: "#000" },
  teacherJob: { fontSize: 12, color: "#888", marginTop: 2 },
  followBtn: {
    backgroundColor: "#a5f3fc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  followText: {
    color: "#0e7490",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 4,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  coursesSection: { paddingTop: 16, paddingBottom: 20 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  reviewCount: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  viewAll: {
    fontSize: 12,
    color: "#06b6d4",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  discount: { fontSize: 11, color: "#888" },
  price: { fontSize: 18, fontWeight: "700", color: "#000", marginTop: 2 },
  cartBtn: {
    backgroundColor: "#06b6d4",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
    justifyContent: "space-between",
  },
  filterButton: {
    borderWidth: 1.5,
    borderColor: "#06b6d4",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
  filterText: {
    fontSize: 12,
    color: "#06b6d4",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
});
