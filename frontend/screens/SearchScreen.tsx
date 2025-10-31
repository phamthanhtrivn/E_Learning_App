import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, ScrollView, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import CategoryButton from "../components/CategoryButton"
import CourseCard from "../components/CourseCard"
import { useFetch } from "../hooks/useFetch"
import { ActivityIndicator } from "react-native-paper"
import { useAuth } from "../contexts/AuthContext"
import { User } from "../types/Types"

type Category = {
  _id: string
  name: string
  icon: string
}

type Course = {
  _id: string
  title: string
  price: number
  rating: number
  reviewCount: number
  lessonCount: number
  thumbnail: string
  teacher: {
    name: string
  }
}

export default function SearchScreen() {
  const { user } = useAuth()
  const { isLoading, error, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL)
  const [categories, setCategories] = useState<Category[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [searchText, setSearchText] = useState("")

  const hotTopics = ["Java", "SQL", "Javascript", "Python", "Digital marketing", "Photoshop", "Watercolor"]

  const fetchCategories = async () => {
    const data = await get("/categories")
    if (data) setCategories(data)
  }

  const fetchRecommendedCourses = async () => {
    const data = await get(`/courses/recommended/${user && (user as User)?._id}`)
    if (data) setRecommendedCourses(data)
  }

  useEffect(() => {
    fetchCategories()
    fetchRecommendedCourses()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            placeholder="Search course"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Hot Topics */}
        <View style={styles.hotTopics}>
          {hotTopics.map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicBtn}>
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
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
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CategoryButton item={item} />}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
            style={styles.categoriesList}
          />
        )}

        {/* Recommended Courses */}
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
            renderItem={({ item }) => <CourseCard {...item} orientation="vertical" />}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={styles.coursesList}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
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
  hotTopics: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 8,
  },
  topicBtn: {
    borderWidth: 1,
    borderColor: "#0A8AFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topicText: { color: "#0A8AFF", fontSize: 12 },
  section: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  viewMore: { fontSize: 13, color: "#0A8AFF" },
  columnWrapper: { justifyContent: "space-between", gap: 12 },
  categoriesList: { marginTop: 16 },
  coursesList: { marginTop: 16 },
  errorText: { color: "red", fontSize: 14, textAlign: "center", marginVertical: 16 },
})