import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CourseCard from "../components/CourseCard";
import TeacherCard from "../components/TeacherCard";

export default function ListViewScreen() {
  const route = useRoute<any>();
  const { data, type } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.resultCount}>{data.length} Results</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) =>
          type === "course" ? (
            <CourseCard {...item} orientation="horizontal" />
          ) : (
            <TeacherCard {...item} layout="horizontal" />
          )
        }
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
