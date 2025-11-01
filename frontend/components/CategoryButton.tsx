import { useNavigation } from "@react-navigation/native"
import { Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useFetch } from "../hooks/useFetch"

type CategoryItemProps = {
  item: {
    _id: string
    name: string
    icon: string
  }
}

// Map icon để React Native biết trước các file cần đóng gói
const iconMapper: Record<string, any> = {
  language: require("../assets/language.png"),
  business: require("../assets/business.png"),
  design: require("../assets/design.png"),
  code: require("../assets/code.png"),
  writing: require("../assets/writing.png"),
  movie: require("../assets/movie.png"),
}

const categoryColors: { [key: string]: string } = {
  business: "#00BCD4",
  design: "#9C27B0",
  code: "#E74C3C",
  writing: "#2196F3",
  movie: "#8253E1",
  language: "#FF9800",
}

export default function CategoryButton({ item }: CategoryItemProps) {
  const bgColor = categoryColors[item.name.toLowerCase()] || "#0A8AFF"
  const navigation = useNavigation<any>()

  const handlePress = () => {
    navigation.navigate("CourseByCategory", {
      _id: item._id,
      name: item.name,
    })
  }

  return (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: bgColor }]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Image
        source={iconMapper[item.icon]}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.categoryTitle}>{item.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  categoryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    minHeight: 120,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    resizeMode: "contain",
  },
  categoryTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
})
