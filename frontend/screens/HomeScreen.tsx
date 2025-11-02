import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFetch } from "../hooks/useFetch";
import { ActivityIndicator } from "react-native-paper";
import CourseCard from "../components/CourseCard";
import TeacherCard from "../components/TeacherCard";
import { useAuth } from "../contexts/AuthContext";
import { Category, Course, Teacher, User } from "../types/Types";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const { user } = useAuth();
  const { isLoading, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [inspirationalCourses, setInspirationalCourses] = useState<Course[]>(
    []
  );
  const [topTeachers, setTopTeachers] = useState<Teacher[]>([]);
  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = useState(false);

  const fetchPopularCourses = async () => {
    const data = await get(`/courses/popular/${(user as User)?._id}`);
    if (data) setPopularCourses(data);
  };

  const fetchRecommendedCourses = async () => {
    const data = await get(`/courses/recommended/${(user as User)?._id}`);
    if (data) setRecommendedCourses(data);
  };

  const fetchInspirationalCourses = async () => {
    const data = await get(`/courses/inspirational/${(user as User)?._id}`);
    if (data) setInspirationalCourses(data);
  };

  const fetchTopTeachers = async () => {
    const data = await get("/teachers");
    if (data) setTopTeachers(data);
  };

  const handleViewMorePC = () => {
    navigation.navigate("ListView", {
      name: "Popular Courses",
      data: popularCourses,
      type: "course",
    });
  };

  const handleViewMoreR = () => {
    navigation.navigate("ListView", {
      name: "Recommended Courses",
      data: recommendedCourses,
      type: "course",
    });
  };

  const handleViewMoreI = () => {
    navigation.navigate("ListView", {
      name: "Inspirational Courses",
      data: inspirationalCourses,
      type: "course",
    });
  };

  const handleViewMoreTT = () => {
    navigation.navigate("ListView", {
      name: "Top Teachers",
      data: topTeachers,
      type: "teacher",
    });
  };

  const loadAllData = async () => {
    await Promise.all([
      fetchPopularCourses(),
      fetchRecommendedCourses(),
      fetchInspirationalCourses(),
      fetchTopTeachers(),
    ]);
  };

  // ✅ FIX: Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadAllData();
  }, []);

  // ✅ FIX: Replace ScrollView with FlatList wrapper
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]} // FlatList cha không hiển thị item, chỉ để scroll
        renderItem={null}
        keyExtractor={() => "dummy"}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* --- HEADER --- */}
            <View style={styles.header}>
              <View>
                <Text style={styles.helloText}>
                  Hello, {(user as User)?.name}
                </Text>
                <Text style={styles.subText}>
                  What do you want to learn today?
                </Text>
              </View>
              <View style={styles.headerRight}>
                <Ionicons
                  onPress={() => navigation.navigate("Cart")}
                  name="cart-outline"
                  size={22}
                  style={styles.icon}
                />
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  style={styles.icon}
                />
              </View>
            </View>

            {/* --- BANNER --- */}
            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>PROJECT MANAGEMENT</Text>
              <Text style={styles.bannerOff}>20% OFF</Text>

              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>JOIN NOW</Text>
              </TouchableOpacity>
            </View>

            {/* --- SECTIONS --- */}
            {renderSection(
              "Popular courses",
              popularCourses,
              handleViewMorePC,
              "vertical",
              isLoading
            )}
            {renderSection(
              "Recommended for you",
              recommendedCourses,
              handleViewMoreR,
              "vertical",
              isLoading
            )}
            {renderSection(
              "Course that inspires",
              inspirationalCourses,
              handleViewMoreI,
              "horizontal",
              isLoading
            )}
            {renderTeacherSection(
              "Top teachers",
              topTeachers,
              handleViewMoreTT,
              isLoading
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

/* ✅ Helper components to avoid repeating code */
const renderSection = (
  title: string,
  data: Course[],
  onPress: () => void,
  orientation: "vertical" | "horizontal",
  loading: boolean
) => (
  <>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.viewMore}>View more</Text>
      </TouchableOpacity>
    </View>

    {loading ? (
      <ActivityIndicator size="large" color="#0A8AFF" animating />
    ) : (
      <FlatList
        data={data.slice(0, 5)}
        horizontal={orientation === "vertical"}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CourseCard {...item} orientation={orientation} />
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.coursesList}
      />
    )}
  </>
);

const renderTeacherSection = (
  title: string,
  data: Teacher[],
  onPress: () => void,
  loading: boolean
) => (
  <>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.viewMore}>View more</Text>
      </TouchableOpacity>
    </View>

    {loading ? (
      <ActivityIndicator size="large" color="#0A8AFF" animating />
    ) : (
      <FlatList
        data={data.slice(0, 5)}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TeacherCard {...item} />}
        showsHorizontalScrollIndicator={false}
        style={styles.teachersList}
      />
    )}
  </>
);

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

  coursesList: {
    marginTop: 16,
    width: "100%",
  },
  teachersList: {
    marginTop: 16,
    marginBottom: 20,
    width: "100%",
  },
});
