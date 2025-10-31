import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CategoryButton from "../components/CategoryButton";
import { useFetch } from "../hooks/useFetch";
import { ActivityIndicator } from "react-native-paper";
import CourseCard from "../components/CourseCard";
import TeacherCard from "../components/TeacherCard";
import { useAuth } from "../contexts/AuthContext";
import { Category, Course, Teacher, User } from "../types/Types";

export default function HomeScreen() {
  const { user } = useAuth()
  const { isLoading, error, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [inspirationalCourses, setInspirationalCourses] = useState<Course[]>(
    []
  );
  const [topTeachers, setTopTeachers] = useState<Teacher[]>([]);

  const fetchCategories = async () => {
    const data = await get("/categories");
    if (data) {
      setCategories(data);
    }
  };

  const fetchPopularCourses = async () => {
    const data = await get(`/courses/popular/${user && (user as User)?._id}`);
    if (data) {
      setPopularCourses(data);
    }
  };

  const fetchRecommendedCourses = async () => {
    const data = await get(`/courses/recommended/${user && (user as User)?._id}`);
    if (data) {
      setRecommendedCourses(data);
    }
  };

  const fetchInspirationalCourses = async () => {
    const data = await get(`/courses/inspirational/${user && (user as User)?._id}`);
    if (data) {
      setInspirationalCourses(data);
    }
  };

  const fetchTopTeachers = async () => {
    const data = await get("/teachers");
    if (data) {
      setTopTeachers(data);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPopularCourses();
    fetchRecommendedCourses();
    fetchInspirationalCourses();
    fetchTopTeachers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.helloText}>Hello, {user && (user as User)?.name}</Text>
            <Text style={styles.subText}>What do you want to learn today?</Text>
          </View>

          <View style={styles.headerRight}>
            <Ionicons name="cart-outline" size={22} style={styles.icon} />
            <Ionicons
              name="notifications-outline"
              size={22}
              style={styles.icon}
            />
          </View>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>PROJECT MANAGEMENT</Text>
          <Text style={styles.bannerOff}>20% OFF</Text>

          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>JOIN NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section Header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.viewMore}>View more</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0A8AFF" animating />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={categories}
            numColumns={2}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <CategoryButton item={item} />}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
            style={styles.categoriesList}
          />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular courses</Text>
          <Text style={styles.viewMore}>View more</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0A8AFF" animating />
        ) : (
          <FlatList
            data={popularCourses}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CourseCard {...item} orientation="vertical" />
            )}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={styles.coursesList}
          />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Text style={styles.viewMore}>View more</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0A8AFF" animating />
        ) : (
          <FlatList
            data={recommendedCourses}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CourseCard {...item} orientation="vertical" />
            )}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={styles.coursesList}
          />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course that inspires</Text>
          <Text style={styles.viewMore}>View more</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0A8AFF" animating />
        ) : (
          <FlatList
            data={inspirationalCourses}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CourseCard {...item} orientation="horizontal" />
            )}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={styles.coursesList}
          />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top teachers</Text>
          <Text style={styles.viewMore}>View more</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0A8AFF" animating />
        ) : (
          <FlatList
            data={topTeachers}
            horizontal
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <TeacherCard {...item} />}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={styles.teachersList}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  helloText: { fontSize: 22, fontWeight: "700", color: "#0A8AFF" },
  subText: { fontSize: 13, color: "#666" },
  headerRight: { flexDirection: "row" },
  icon: { marginLeft: 10 },

  banner: {
    backgroundColor: "#0A8AFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bannerOff: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginVertical: 6,
  },
  bannerBtn: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  bannerBtnText: {
    color: "#0A8AFF",
    fontWeight: "700",
    fontSize: 13,
  },

  section: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  viewMore: { fontSize: 13, color: "#0A8AFF" },

  columnWrapper: {
    justifyContent: "space-between",
    gap: 12,
  },
  categoriesList: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 16,
  },
  coursesList: {
    marginTop: 16,
    width: "100%",
  },
  teachersList: {
    marginTop: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});
