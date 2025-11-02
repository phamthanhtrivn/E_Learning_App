import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CourseCard from "../components/CourseCard";
import { Course } from "../types/Types";
import { useFetch } from "../hooks/useFetch";

export default function CourseByCategoryScreen() {
  const { get, isLoading } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const route = useRoute<any>();
  const { _id } = route.params;

  const [results, setResults] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCourses = async () => {
    const res = await get(`/courses/category/${_id}`);
    if (res) {
      setResults(res.results || []);
      setTotal(res.total || 0);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [_id]);

  // Loading UI
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00BDD6" />
        <Text style={styles.loadingText}>Đang tải khóa học...</Text>
      </View>
    );
  }

  // Empty UI
  if (!isLoading && results.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Không có khóa học nào</Text>
        <Text style={styles.emptySubtitle}>
          Hãy thử chọn danh mục khác nhé!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resultCount}>{total} Results</Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CourseCard {...item} orientation="horizontal" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  resultCount: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 16,
    color: "#111",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
