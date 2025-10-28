import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TeacherCardProps = {
  _id: string;
  name: string;
  job: string;
  profilePicture: string;
  rating: string;
  reviewCount: number;
};

export default function TeacherCard({
  name,
  job,
  profilePicture,
  rating,
  reviewCount,
}: TeacherCardProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.job}>{job}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#FFB800" />
        <Text style={styles.rating}>{rating}</Text>
        <Text style={styles.reviewCount}>({reviewCount})</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  job: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 11,
    color: "#999",
    marginLeft: 2,
  },
});
