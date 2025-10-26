import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CourseCard from "../components/CourseCard";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <CourseCard
        title="PHP in One Click"
        author="Ramono Wultschner"
        price="$59"
        rating={4.5}
        totalReviews={1233}
        lessons={18}
        image="https://example.com/php.jpg"
        orientation="horizontal"
      />
    </SafeAreaView>
  );
}
