import type React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { User } from "../types/Types"
import { useFetch } from "../hooks/useFetch"

interface CourseCardProps {
  _id: string
  title: string
  price: number
  rating: number
  reviewCount: number
  lessonCount: number
  thumbnail: string
  orientation?: "vertical" | "horizontal"
}

const CourseCard: React.FC<CourseCardProps> = ({
  _id,
  title,
  price,
  rating,
  reviewCount,
  lessonCount,
  thumbnail,
  orientation = "vertical",
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: orientation === "horizontal" ? "row" : "column",
      backgroundColor: "#fff",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      margin: 8,
      width: orientation === "vertical" ? 180 : "92%",
      height: orientation === "horizontal" ? 140 : "auto",
      position: "relative",
      borderWidth: 1,
      borderColor: "#eee",
    },
    imageContainer: {
      position: "relative",
    },
    image: {
      width: orientation === "vertical" ? "100%" : 130,
      height: orientation === "vertical" ? 100 : 140,
      resizeMode: "cover",
    },
    content: {
      flex: 1,
      padding: orientation === "horizontal" ? 14 : 12,
      paddingRight: orientation === "horizontal" ? 40 : 14,
      justifyContent: orientation === "horizontal" ? "space-between" : "flex-start",
    },
    title: {
      fontSize: orientation === "horizontal" ? 15 : 14,
      fontWeight: "600",
      color: "#222",
      marginBottom: 6,
      lineHeight: 20,
      flex: 1,
    },
    price: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#00AEEF",
      marginBottom: 8,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ratingText: {
      fontSize: 12,
      color: "#666",
    },
    bookmark: {
      position: "absolute",
      top: 8,
      right: 8,
      zIndex: 10,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 12,
      padding: 4,
    },
  })
  const { user, setUser } = useAuth()
  const { post } = useFetch(process.env.EXPO_PUBLIC_BASE_URL)
  const [isSaved, setIsSaved] = useState((user as User)?.savedCourses?.includes(_id) || false)
  
  const navigation = useNavigation<any>()

  const handleNavigate = () => {
    navigation.navigate("CourseDetail", { _id })
  }

  const handleToggleSave = async () => {
    
    const response = await post(`/users/saveCourse`, { userId: (user as User)._id, courseId: _id })

    if (response?.savedCourses) {
      setIsSaved(response.savedCourses.includes(_id))
      setUser({ ...user, savedCourses: response.savedCourses } as User)
    }
    setIsSaved(!isSaved)
  }

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <TouchableOpacity
        style={[styles.bookmark, isSaved && { backgroundColor: "#E0F7FF" }]}
        onPress={handleToggleSave}
        activeOpacity={0.7}
      >
        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? "#00AEEF" : "#999"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageContainer} onPress={handleNavigate}>
        <Image source={{ uri: thumbnail }} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.content} onPress={handleNavigate}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.price}>${price}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F4B400" />
          <Text style={styles.ratingText}>
            {rating} ({reviewCount}) • {lessonCount} lessons
          </Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default CourseCard