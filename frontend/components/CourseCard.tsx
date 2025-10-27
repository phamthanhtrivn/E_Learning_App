import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CourseCardProps {
  title: string;
  author: string;
  price: string;
  rating: number;
  totalReviews: number;
  lessons: number;
  image: string;
  orientation?: "vertical" | "horizontal";
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  author,
  price,
  rating,
  totalReviews,
  lessons,
  image,
  orientation = "vertical",
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: orientation === "horizontal" ? "row" : "column",
      backgroundColor: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      margin: 8,
      width: orientation === "vertical" ? 180 : "95%",
    },
    image: {
      width: orientation === "vertical" ? "100%" : 100,
      height: 100,
      resizeMode: "cover",
    },
    content: {
      flex: 1,
      padding: 10,
      justifyContent:
        orientation === "horizontal" ? "center" : "flex-start",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: "#222",
      marginBottom: 4,
    },
    author: {
      fontSize: 13,
      color: "#666",
      marginBottom: 6,
    },
    price: {
      fontSize: 15,
      fontWeight: "bold",
      color: "#00AEEF",
      marginBottom: 6,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      fontSize: 13,
      color: "#444",
      marginLeft: 4,
    },
    bookmark: {
      position: "absolute",
      top: 8,
      right: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Ionicons
        name="bookmark-outline"
        size={20}
        color="#222"
        style={styles.bookmark}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.price}>{price}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F4B400" />
          <Text style={styles.ratingText}>
            {rating} ({totalReviews}) • {lessons} lessons
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CourseCard;
