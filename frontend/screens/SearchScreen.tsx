import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CategoryButton from "../components/CategoryButton";
import CourseCard from "../components/CourseCard";
import { useFetch } from "../hooks/useFetch";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { Category, Course, User } from "../types/Types";
import SearchResults from "../components/SearchResults";
import { useNavigation } from "@react-navigation/native";

export default function SearchScreen() {
  const { user } = useAuth();
  const { isLoading, error, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation<any>();

  const fetchCategories = async () => {
    const data = await get("/categories");
    if (data) setCategories(data);
  };

  const fetchRecommendedCourses = async () => {
    const data = await get(
      `/courses/recommended/${user && (user as User)?._id}`
    );
    if (data) setRecommendedCourses(data);
  };

  const handleViewMoreR = () => {
    navigation.navigate("ListView", {
      name: "Recommended Courses",
      data: recommendedCourses,
      type: "course",
    });
  };

  useEffect(() => {
    fetchCategories();
    fetchRecommendedCourses();
  }, []);

  const listData = isSearching ? [] : categories; // FlatList data source ✅

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item._id}
        scrollEnabled={!isSearching} // Disable scroll if searching
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CategoryButton item={item} />}
        numColumns={2}
        columnWrapperStyle={!isSearching ? styles.columnWrapper : undefined}
        ListHeaderComponent={
          <>
            {/* 🔍 Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#666" />
              <TextInput
                placeholder="Search course"
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  if (text.trim().length === 0) setIsSearching(false);
                }}
                style={styles.searchInput}
              />
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => {
                  if (searchText.trim().length > 0) setIsSearching(true);
                }}
              >
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </View>

            {/* 🔎 If searching → show SearchResults instead of everything else */}
            {isSearching && <SearchResults keyword={searchText} />}

            {!isSearching && (
              <>
                {/* Categories Title */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Categories</Text>
                </View>

                {isLoading && (
                  <ActivityIndicator size="large" color="#0A8AFF" animating />
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}
              </>
            )}
          </>
        }
        ListFooterComponent={
          !isSearching ? (
            <>
              {/* Recommended section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                <TouchableOpacity onPress={handleViewMoreR}>
                  <Text style={styles.viewMore}>View more</Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#0A8AFF" animating />
              ) : (
                <FlatList
                  data={recommendedCourses.slice(0, 5)}
                  horizontal
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <CourseCard
                      {...item}
                      teacherName={item.teacher.name}
                      orientation="vertical"
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  style={styles.coursesList}
                />
              )}
            </>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterBtn: {
    backgroundColor: "#0A8AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterText: { color: "#fff", fontWeight: "600" },
  section: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  viewMore: { fontSize: 13, color: "#0A8AFF" },
  columnWrapper: { justifyContent: "space-between", gap: 12 },
  coursesList: { marginTop: 16 },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 16,
  },
});
