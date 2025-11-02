import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function CartHeader() {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.logoContainer}
            >
                <Ionicons name="cart-outline" size={24} color="#4F46E5" />
                <Text style={styles.logoText}>CourseHub</Text>
            </TouchableOpacity>

            <TouchableOpacity
            >
                <Text style={styles.navText}>Back to Courses</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        backgroundColor: "#FFF",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#111827",
    },
    navText: {
        fontSize: 14,
        color: "#6B7280",
    },
});
