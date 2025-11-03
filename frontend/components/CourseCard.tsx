"use client"

import React, { useEffect } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import type { User } from "../types/Types"
import { useFetch } from "../hooks/useFetch"

interface CourseCardProps {
  _id: string
  title: string
  description?: string
  price: number
  rating: number
  reviewCount: number
  lessonCount: number
  totalDuration?: string
  thumbnail: string
  orientation?: "vertical" | "horizontal"
  teacherName?: string
}

const CourseCard: React.FC<CourseCardProps> = ({
  _id,
  title,
  description,
  price,
  rating,
  reviewCount,
  lessonCount,
  totalDuration,
  thumbnail,
  orientation = "vertical",
  teacherName,
}) => {
  const { user, setUser } = useAuth()
  const { post } = useFetch(process.env.EXPO_PUBLIC_BASE_URL)
  const [isSaved, setIsSaved] = useState((user as User)?.savedCourses?.includes(_id) || false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (user && user.savedCourses) {
      const saved = user.savedCourses.some(course =>
        typeof course === "string" ? course === _id : course._id === _id
      )
      setIsSaved(saved)
    }
  }, [user, _id])


  const styles = StyleSheet.create({
    container: {
      flexDirection: orientation === "horizontal" ? "row" : "column",
      backgroundColor: "#fff",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      margin: orientation === "horizontal" ? 0 : 8,
      marginBottom: orientation === "horizontal" ? 12 : 8,
      marginHorizontal: orientation === "horizontal" ? 16 : 8,
      width: orientation === "vertical" ? 170 : undefined,
      height: orientation === "horizontal" ? undefined : "auto",
      minHeight: orientation === "horizontal" ? 150 : "auto",
      position: "relative",
      borderWidth: 1,
      borderColor: "#f0f0f0",
      borderRadius: 12,
    },
    imageContainer: {
      position: "relative",
      flexShrink: 0,
    },
    image: {
      width: orientation === "vertical" ? "100%" : 130,
      height: orientation === "vertical" ? 100 : 150,
      resizeMode: "cover",
      borderRadius: orientation === "vertical" ? 12 : 8,
    },
    content: {
      flex: 1,
      padding: orientation === "horizontal" ? 14 : 10,
      paddingRight: orientation === "horizontal" ? 50 : 12,
      justifyContent: "space-between",
    },
    topSection: {
      marginBottom: 8,
    },
    title: {
      fontSize: orientation === "horizontal" ? 14 : 13,
      fontWeight: "600",
      color: "#1a1a1a",
      marginBottom: 4,
      lineHeight: 18,
    },
    teacherName: {
      fontSize: 12,
      color: "#999",
      marginBottom: 4,
      fontWeight: "500",
    },
    description: {
      fontSize: 12,
      color: "#999",
      lineHeight: 16,
      marginBottom: 4,
    },
    price: {
      fontSize: 15,
      fontWeight: "700",
      color: "#00AEEF",
      marginBottom: 6,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      flexWrap: "wrap",
    },
    ratingText: {
      fontSize: 12,
      color: "#999",
      fontWeight: "500",
    },
    bookmark: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 10,
      backgroundColor: "#E0F7FF",
      borderRadius: 20,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  })

  const navigation = useNavigation<any>()

  const handleNavigate = () => {
    navigation.navigate("CourseDetail", { _id, isSaved })
  }

  const handleToggleSave = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await post(`/users/saveCourse`, {
        userId: (user as User)._id,
        courseId: _id,
      })

      if (response?.savedCourses) {
        const newSavedState = response.savedCourses.includes(_id)
        setIsSaved(newSavedState)
        setUser({ ...user, savedCourses: response.savedCourses } as User)
      }
    } catch (error) {
      console.log("[v0] Error saving course:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <TouchableOpacity
        style={[styles.bookmark, isSaved && { backgroundColor: "#E0F7FF" }]}
        onPress={handleToggleSave}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? "#00AEEF" : "#ccc"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageContainer} onPress={handleNavigate}>
        <Image source={{ uri: thumbnail }} style={styles.image} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={handleNavigate}>
        <View style={styles.topSection}>
          <Text style={styles.title} numberOfLines={orientation === "horizontal" ? 2 : 3}>
            {title}
          </Text>
          {teacherName && <Text style={styles.teacherName}>{teacherName}</Text>}
          {orientation === "horizontal" && description && (
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          )}
        </View>

        <View>
          <Text style={styles.price}>${price}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#F4B400" />
            <Text style={styles.ratingText}>
              {rating} ({reviewCount})
            </Text>
            {orientation === "horizontal" && totalDuration && (
              <>
                <Text style={styles.ratingText}>•</Text>
                <Text style={styles.ratingText}>{totalDuration}</Text>
              </>
            )}
            {orientation !== "horizontal" && (
              <>
                <Text style={styles.ratingText}>•</Text>
                <Text style={styles.ratingText}>{lessonCount} lessons</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default CourseCard
