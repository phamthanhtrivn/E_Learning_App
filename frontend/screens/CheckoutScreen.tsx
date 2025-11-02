import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Course, Teacher, User } from "../types/Types";
import { useFetch } from "../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";

export default function CheckoutScreen() {
  const { user, setUser } = useAuth();
  const { get, post } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]); // Lưu cart từ server
  const [fetching, setFetching] = useState(true);

  // Fetch cart từ server khi mount
  const fetchCart = async () => {
    if (!user?._id) return;
    setFetching(true);
    try {
      const res = await get(`/users/cart/${user._id}`);
      setCourses(res.cart || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCourses([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?._id]);

  // Tính toán totals
  const subtotal = useMemo(
    () => courses.reduce((sum, item) => sum + item.price, 0),
    [courses]
  );
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  // Xóa cart
  const clearCart = async () => {
    try {
      await get(`/users/cart/clear/${(user as User)._id}`);
      setCourses([]);
      setUser({ ...(user as User), cart: [] });
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // Confirm payment
  const handleConfirmPayment = async () => {
    if (courses.length === 0) {
      Alert.alert("Cart is empty", "Add some courses before checkout.");
      return;
    }

    setLoading(true);
    try {
      const promises = courses.map((course) =>
        post("/enrollments", {
          userId: (user as User)._id,
          courseId: course._id,
        })
      );
      await Promise.all(promises);

      await clearCart();

      Alert.alert(
        "✅ Payment Completed!",
        "Courses have been enrolled successfully."
      );
      navigation.navigate("MainTabs", { screen: "MyCourses" });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* USER INFO */}
      <View style={styles.userBox}>
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Selected Courses</Text>

      {courses.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Your cart is empty
        </Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemInstructor}>
                  {(item.teacherId as Teacher)?.name || "Unknown"}
                </Text>
                <Text style={styles.itemPrice}>₫{item.price}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 180 }}
        />
      )}

      {/* SUMMARY */}
      <View style={styles.footer}>
        <View style={styles.row}>
          <Text>Subtotal ({courses.length} courses)</Text>
          <Text>₫{subtotal}</Text>
        </View>
        <View style={styles.row}>
          <Text>Tax (10%)</Text>
          <Text>₫{tax}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>₫{total}</Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleConfirmPayment}
          disabled={loading}
        >
          <Text style={styles.payText}>
            {loading ? "Processing..." : "Confirm Payment"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  userBox: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  avatar: { width: 55, height: 55, borderRadius: 28, marginRight: 12 },
  userName: { fontSize: 18, fontWeight: "600" },
  userEmail: { color: "#666", fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  item: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 8, justifyContent: "space-evenly" },
  itemTitle: { fontWeight: "700" },
  itemInstructor: { color: "#666" },
  itemPrice: { marginTop: 4, fontWeight: "700", color: "red" },
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
    marginBottom: 8,
  },
  totalText: { fontWeight: "700" },
  totalPrice: { fontWeight: "700", fontSize: 18, color: "#e63946" },
  payBtn: {
    backgroundColor: "#e63946",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  payText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
