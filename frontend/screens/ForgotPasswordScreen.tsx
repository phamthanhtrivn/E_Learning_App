import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import { useFetch } from "../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const { isLoading, post } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }

    const response = await post("/users/forgot-password", { email });

    if (response?.message) {
      Alert.alert("Success", response.message);
    } else {
      Alert.alert("Error", response?.message || "Failed to send reset link.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>E-Learning</Text>
          <Text style={styles.subtitle}>Reset your password</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleReset}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.submitBtnText}>Send Reset Link</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomTextContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.bottomLink}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 80,
    marginTop: 120,
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    fontWeight: "500",
  },
  formContainer: {
    marginBottom: 30,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  inputIcon: {
    color: "#64748b",
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#e2e8f0",
  },
  eyeIcon: {
    color: "#64748b",
    marginLeft: 10,
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "500",
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: 20,
  },
  bottomText: {
    fontSize: 14,
    color: "#cbd5e1",
  },
  bottomLink: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "700",
  },
});
