import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { Teacher } from "../types/Types"

interface TeacherCardProps extends Teacher {
  layout?: "vertical" | "horizontal"
}

export default function TeacherCard({
  _id,
  name,
  job,
  profilePicture,
  rating,
  reviewCount,
  layout = "vertical",
}: TeacherCardProps) {
  const navigation = useNavigation<any>()

  const handleNavigate = () => {
    navigation.navigate("TeacherProfile", { _id })
  }

  return (
    <TouchableOpacity
      style={[styles.container, layout === "horizontal" && styles.containerHorizontal]}
      activeOpacity={0.7}
      onPress={handleNavigate}
    >
      <Image
        source={{ uri: profilePicture }}
        style={[styles.profileImage, layout === "horizontal" && styles.profileImageHorizontal]}
      />

      <View style={[styles.contentContainer, layout === "horizontal" && styles.contentContainerHorizontal]}>
        <Text style={[styles.name, layout === "horizontal" && styles.nameHorizontal]}>{name}</Text>
        <Text style={[styles.job, layout === "horizontal" && styles.jobHorizontal]}>{job}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFB800" />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.reviewCount}>({reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  // Vertical Layout (default)
  container: {
    width: 160,
    marginRight: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 3,
    borderRadius: 16,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 6,
  },
  job: {
    fontSize: 13,
    color: "#7a7a7a",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  rating: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  reviewCount: {
    fontSize: 12,
    color: "#a0a0a0",
    fontWeight: "500",
  },

  // Horizontal Layout
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginRight: 0,
    marginBottom: 12,
    borderRadius: 14,
  },
  profileImageHorizontal: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 0,
    marginRight: 14,
    flexShrink: 0,
  },
  contentContainerHorizontal: {
    alignItems: "flex-start",
    flex: 1,
  },
  nameHorizontal: {
    fontSize: 16,
    textAlign: "left",
  },
  jobHorizontal: {
    fontSize: 13,
    textAlign: "left",
  },
})
