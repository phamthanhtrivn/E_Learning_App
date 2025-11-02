import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Course } from "../types/Types";
import { useAuth } from "../contexts/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { get, del } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const navigation = useNavigation<any>()

  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const res = await get(`/users/cart/${user._id}`);
      setItems(res.cart || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setItems([]);
      Toast.show({
        type: "error",
        text1: "Fetch Error",
        text2: "Cannot load cart. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleRemove = async (courseId: string) => {
    if (!user?._id) return;
    setLoading(true);

    try {
      const res = await del(`/users/cart/${user._id}/${courseId}`);

      if (res?.cart) {
        fetchCart();
        Toast.show({
          type: "success",
          text1: "Removed!",
          text2: "Course has been removed from your cart.",
          position: "top",
          visibilityTime: 2000,
          topOffset: 50,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong.",
          position: "top",
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Please try again later.",
        position: "top",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={60} color="#999" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Start learning by adding some courses to your cart
          </Text>
        </View>
      ) : (
        <>
          {items.map((item, index) => (
            <View key={item._id || index} style={styles.item}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemInstructor}>
                  {typeof item.teacherId === "object" && item.teacherId?.name
                    ? item.teacherId.name
                    : "Unknown"}
                </Text>
                <Text style={styles.itemPrice}>₫{item.price}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => handleRemove(item._id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.summary}>
            <View style={styles.row}>
              <Text>Subtotal ({items.length} courses)</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleCheckout}>
              <Text style={styles.buttonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  heading: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", marginTop: 16 },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  item: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 8 },
  itemTitle: { fontWeight: "700" },
  itemInstructor: { color: "#666" },
  itemPrice: { marginTop: 4, fontWeight: "700" },
  itemActions: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  removeText: { color: "red" },
  summary: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalText: { fontWeight: "700" },
  totalPrice: { fontWeight: "700", fontSize: 18, color: "#3B82F6" },
});
