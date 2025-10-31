import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../contexts/AuthContext";

type Enrollment = {
  _id: string;
  progress: number;
  status: "ONGOING" | "COMPLETED";
  courseId: {
    _id: string;
    title: string;
    thumbnail: string;
    totalDuration: string;
  };
};

export default function MyCoursesScreen() {
  const { user } = useAuth();
  const { isLoading, error, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [activeTab, setActiveTab] = useState<"ALL" | "ONGOING" | "COMPLETED">("ALL");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await get('/enrollments/user/' + (user && user._id));
      setEnrollments(res || []);
    };
    fetchData();
  }, []);

  const filteredCourses = enrollments.filter((e) => {
    if (activeTab === "ALL") return true;
    return e.status === activeTab;
  });

  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>Courses that boost your career!</Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Check Now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: "https://res.cloudinary.com/dsnuolexo/image/upload/v1761737805/image-Photoroom_dkzahz.png" }}
          style={styles.bannerImage}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["ALL", "ONGOING", "COMPLETED"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Image
              source={{ uri: item.courseId.thumbnail }}
              style={styles.courseImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.courseTitle}>{item.courseId.title}</Text>
              <Text style={styles.courseDuration}>
                {item.courseId.totalDuration}
              </Text>
              <Text style={styles.progressText}>{item.progress}% Complete</Text>
              <Progress.Bar
                progress={item.progress / 100}
                color="#7c3aed"
                unfilledColor="#e2e8f0"
                borderWidth={0}
                width={180}
                height={6}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", padding: 16, color: "#000" },
  banner: {
    marginTop: 16,
    backgroundColor: "#E9D5FF",
    marginHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  bannerTitle: { fontSize: 14, color: "#4B0082", fontWeight: "600", width: 150 },
  bannerBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  bannerBtnText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  bannerImage: { width: 150, height: 150, borderRadius: 40, resizeMode: "contain" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    paddingBottom: 8,
  },
  tabText: { color: "#94A3B8", fontSize: 13, fontWeight: "600", textAlign: "center" },
  tabTextActive: { color: "#7c3aed" },
  tabUnderline: {
    height: 2,
    backgroundColor: "#7c3aed",
    width: 30,
    alignSelf: "center",
    marginTop: 4,
    borderRadius: 2,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  courseImage: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },
  courseTitle: { fontSize: 14, fontWeight: "600", color: "#000" },
  courseDuration: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  progressText: { fontSize: 11, color: "#6b7280", marginTop: 6, marginBottom: 4 },
});
