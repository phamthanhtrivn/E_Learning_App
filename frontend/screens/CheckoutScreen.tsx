import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import CourseCard from "../components/CourseCard";

const CheckoutScreen: React.FC = () => {
  /* === MOCK DATA (Temporary) === */
  const mockUser = {
    _id: "u123",
    name: "John Carter",
    email: "john.carter@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
  };

  const mockCourses = [
    {
      _id: "c1",
      title: "React Native From Zero to Hero",
      price: 299000,
      rating: 4.8,
      reviewCount: 1200,
      lessonCount: 42,
      thumbnail: "https://i.ibb.co/pw8jY4N/rn-course.png",
    },
    {
      _id: "c2",
      title: "NodeJS + ExpressJS Practical API Development",
      price: 259000,
      rating: 4.7,
      reviewCount: 980,
      lessonCount: 38,
      thumbnail: "https://i.ibb.co/ckq6WHc/node-course.png",
    },
  ];

  /* === CALCULATE TOTAL === */
  const totalPrice = useMemo(
    () => mockCourses.reduce((sum, item) => sum + item.price, 0),
    []
  );

  const handleConfirmPayment = () => {
    Alert.alert("✅ Completed!", "Fake payment successful. Courses are now saved to your account.");
  };

  return (
    <View style={styles.container}>
      {/* === USER INFO === */}
      <View style={styles.userBox}>
        <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>
        </View>
      </View>

      {/* === SECTION TITLE === */}
      <Text style={styles.sectionTitle}>Selected Courses</Text>

      {/* === COURSE LIST === */}
      <FlatList
        data={mockCourses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CourseCard {...item} orientation="horizontal" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* === TOTAL + BUTTON === */}
      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice}</Text>
        </View>

        <TouchableOpacity style={styles.payBtn} onPress={handleConfirmPayment}>
          <Text style={styles.payText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;

/* === STYLES === */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  /* USER BOX */
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 14,
  },
  avatar: { width: 55, height: 55, borderRadius: 28, marginRight: 12 },
  userName: { fontSize: 18, fontWeight: "600" },
  userEmail: { color: "#666", fontSize: 14 },

  /* SECTION TITLE */
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e5e5",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 18, fontWeight: "600", color: "#333" },
  totalValue: { fontSize: 20, fontWeight: "700", color: "#e63946" },

  payBtn: {
    backgroundColor: "#e63946",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
