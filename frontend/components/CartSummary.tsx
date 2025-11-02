import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, tax, total, itemCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order Summary</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text>Subtotal ({itemCount} course{itemCount !== 1 ? "s" : ""})</Text>
          <Text>₫{subtotal.toLocaleString("vi-VN")}</Text>
        </View>
        <View style={styles.row}>
          <Text>Tax (10%)</Text>
          <Text>₫{tax.toLocaleString("vi-VN")}</Text>
        </View>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalPrice}>₫{total.toLocaleString("vi-VN")}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalText: {
    fontWeight: "700",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3B82F6",
  },
  checkoutButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
  },
  continueButton: {
    borderWidth: 1,
    borderColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  continueText: {
    color: "#3B82F6",
    fontWeight: "700",
  },
});
