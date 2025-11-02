"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native"
import { Feather } from "@expo/vector-icons"
import * as Progress from "react-native-progress"
import { LinearGradient } from "expo-linear-gradient"
import { useFetch } from "../hooks/useFetch"
import { useAuth } from "../contexts/AuthContext"
import type { Enrollment } from "../types/Types"

export default function MyCoursesScreen() {
  const { user } = useAuth()
  const { isLoading, error, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL)
  const [activeTab, setActiveTab] = useState<"ALL" | "ONGOING" | "COMPLETED">("ALL")
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await get("/enrollments/user/" + (user && user._id))
      setEnrollments(res || [])
    }
    fetchData()
  }, [])

  const filteredCourses = enrollments.filter((e) => {
    if (activeTab === "ALL") return true
    return e.status === activeTab
  })

  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    )

  if (error) return <Text style={styles.errorText}>Error: {error}</Text>

  return (
    <View style={styles.container}>


      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Expand your skills</Text>
          <Text style={styles.bannerSubtitle}>Explore new courses to grow faster</Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Discover</Text>
            <Feather name="arrow-right" size={14} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.bannerImageWrapper}>
          <Image
            source={{ uri: "https://res.cloudinary.com/dsnuolexo/image/upload/v1761737805/image-Photoroom_dkzahz.png" }}
            style={styles.bannerImage}
          />
        </View>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {["ALL", "ONGOING", "COMPLETED"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.courseCard} activeOpacity={0.85}>
            <Image
              source={{ uri: typeof item.courseId === "object" ? item.courseId.thumbnail : "" }}
              style={styles.courseImage}
            />
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle} numberOfLines={2}>
                {typeof item.courseId === "object" ? item.courseId.title : ""}
              </Text>
              <Text style={styles.courseDuration}>
                {typeof item.courseId === "object" ? item.courseId.totalDuration : ""}
              </Text>
              <View style={styles.progressContainer}>
                <Progress.Bar
                  progress={item.progress / 100}
                  color="#6366f1"
                  unfilledColor="#e2e8f0"
                  borderWidth={0}
                  width={200}
                  height={5}
                  borderRadius={2.5}
                />
                <Text style={styles.progressText}>{item.progress}%</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#ef4444",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  banner: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  bannerContent: { flex: 1 },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "400",
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  bannerBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  bannerImageWrapper: {
    overflow: "hidden",
    borderRadius: 12,
  },
  bannerImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: "contain",
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#6366f1",
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#e2e8f0",
  },
  courseContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  courseDuration: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
    fontWeight: "500",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366f1",
    minWidth: 30,
  },
})
