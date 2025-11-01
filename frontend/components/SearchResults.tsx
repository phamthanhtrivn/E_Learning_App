import { useEffect, useState } from "react"
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native"
import { useFetch } from "../hooks/useFetch"
import CourseCard from "./CourseCard"
import { Course } from "../types/Types"

type Props = {
  keyword: string
}

export default function SearchResults({ keyword }: Props) {
  const { get, isLoading } = useFetch(process.env.EXPO_PUBLIC_BASE_URL)
  const [results, setResults] = useState<Course[]>([])
  const [total, setTotal] = useState(0)

  const fetchSearch = async () => {
    if (!keyword.trim()) return
    const data = await get(`/courses/search?q=${encodeURIComponent(keyword)}`)
    if (data?.results) {
      setResults(data.results)
      setTotal(data.total)
    }
  }

  useEffect(() => {
    fetchSearch()
  }, [keyword])

  return (
    <View style={styles.container}>
      {keyword ? (
        <Text style={styles.resultCount}>{total} Results</Text>
      ) : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0A8AFF" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <CourseCard {...item} orientation="horizontal" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  resultCount: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
})
