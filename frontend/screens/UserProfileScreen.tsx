import React, { useState, useEffect, use } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import CourseCard from "../components/CourseCard";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../contexts/AuthContext";
import { Course } from "../types/Types";

export type counts = {
  saved: number;
  ongoing: number;
  completed: number;
};
export type UserProfile = {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  location?: string;
  profilePicture?: string;
  job?: string;
  phone?: string;
  savedCourses?: Course[];
  courseCount?: number;
  rating?: number;
  reviewCount?: number;
};

const UserProfile = () => {
  const { user } = useAuth();
  const { isLoading, error, get } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [counts, setCounts] = useState<counts>({
    saved: 0,
    ongoing: 0,
    completed: 0,
  });
  useEffect(() => {
    const fetchUser = async () => {
      const data = await get("/users/" + (user && user._id));
      setUserData(data.user);
      setSavedCourses(data.savedCourses);
      setCounts(data.counts);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View>
        <Text>No user data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={userData} />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{counts.saved}</Text>
            <Text style={styles.statLabel}>Save</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{counts.ongoing}</Text>
            <Text style={styles.statLabel}>On Going</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{counts.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>Saved courses</Text>

          {savedCourses.map((course) => (
            <CourseCard {...course} orientation="horizontal" />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  coursesSection: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginLeft: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#888",
  },
});

export default UserProfile;
