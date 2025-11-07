import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from "react-native"
import { useAuth } from "../contexts/AuthContext"
import { useFetch } from "../hooks/useFetch"
import type { User } from "../types/Types"
import { Ionicons } from "@expo/vector-icons"

const DetailProfileUserScreen = () => {
    const { user, setUser } = useAuth()
    const { isLoading, error, get, put } = useFetch(process.env.EXPO_PUBLIC_BASE_URL)

    const [userData, setUserData] = useState<User | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        job: "",
        phone: "",
    })
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await get("/users/" + user?._id);
                if (data?.user) {
                    setUserData(data.user);
                    setFormData({
                        name: data.user.name || "",
                        email: data.user.email || "",
                        job: data.user.job || "",
                        phone: data.user.phone || "",
                    });
                }
            } catch (err) {
                console.error("Lỗi khi tải user:", err);
            }
        };

        if (user?._id) fetchUser();
    }, [user]);

    const handleSave = async () => {
        try {
            const updated = await put("/users/" + user?._id, formData)
            setUserData(updated.user)
            setUser(updated.user);
            setIsEditing(false)
            Alert.alert("✅ Thành công", "Thông tin cá nhân đã được cập nhật!")
        } catch (err) {
            console.error(err)
            Alert.alert("❌ Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.")
        }
    }

    const handleCancel = () => {
        if (userData) {
            setFormData({
                name: userData.name || "",
                email: userData.email || "",
                job: userData.job || "",
                phone: userData.phone || "",
            })
        }
        setIsEditing(false)
    }

    if (isLoading)
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0F172A" />
            </View>
        )

    if (error)
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        )

    if (!userData)
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>No user data</Text>
            </View>
        )

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerSection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: userData.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                        }}
                        style={styles.avatar}
                    />
                    <View style={styles.statusIndicator} />
                </View>

                <Text style={styles.userName}>{userData.name || "User Profile"}</Text>
                <Text style={styles.userJob}>{userData.job || "No job info"}</Text>

                <TouchableOpacity
                    onPress={() => setIsEditing(!isEditing)}
                    style={[styles.editButton, isEditing && styles.editButtonActive]}
                >
                    <Ionicons name={isEditing ? "close" : "pencil"} size={18} color="#fff" />
                    <Text style={styles.editButtonText}>{isEditing ? "Huỷ" : "Chỉnh sửa"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                {/* Name Field */}
                <View style={styles.fieldCard}>
                    <View style={styles.fieldHeader}>
                        <Ionicons name="person" size={20} color="#0F172A" />
                        <Text style={styles.fieldLabel}>Tên</Text>
                    </View>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(t) => setFormData({ ...formData, name: t })}
                            placeholderTextColor="#94a3b8"
                        />
                    ) : (
                        <Text style={styles.fieldValue}>{userData.name || "—"}</Text>
                    )}
                </View>

                {/* Email Field */}
                <View style={styles.fieldCard}>
                    <View style={styles.fieldHeader}>
                        <Ionicons name="mail" size={20} color="#0F172A" />
                        <Text style={styles.fieldLabel}>Email</Text>
                    </View>
                    <Text style={[styles.fieldValue, { opacity: 0.7 }]}>{userData.email}</Text>
                </View>

                {/* Job Field */}
                <View style={styles.fieldCard}>
                    <View style={styles.fieldHeader}>
                        <Ionicons name="briefcase" size={20} color="#0F172A" />
                        <Text style={styles.fieldLabel}>Công việc</Text>
                    </View>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={formData.job}
                            onChangeText={(t) => setFormData({ ...formData, job: t })}
                            placeholder="Nhập công việc..."
                            placeholderTextColor="#94a3b8"
                        />
                    ) : (
                        <Text style={styles.fieldValue}>{userData.job || "—"}</Text>
                    )}
                </View>

                {/* Phone Field */}
                <View style={styles.fieldCard}>
                    <View style={styles.fieldHeader}>
                        <Ionicons name="call" size={20} color="#0F172A" />
                        <Text style={styles.fieldLabel}>Số điện thoại</Text>
                    </View>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(t) => setFormData({ ...formData, phone: t })}
                            keyboardType="phone-pad"
                            placeholder="Nhập số điện thoại..."
                            placeholderTextColor="#94a3b8"
                        />
                    ) : (
                        <Text style={styles.fieldValue}>{userData.phone || "—"}</Text>
                    )}
                </View>

                {isEditing && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                            <Ionicons name="checkmark" size={20} color="#fff" />
                            <Text style={styles.saveText}>Lưu thay đổi</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
                            <Ionicons name="close" size={20} color="#0F172A" />
                            <Text style={styles.cancelText}>Huỷ</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default DetailProfileUserScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
    },
    errorText: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
    },
    headerSection: {
        backgroundColor: "#fff",
        paddingTop: 32,
        paddingBottom: 28,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: "#0f172a",
        backgroundColor: "#e2e8f0",
    },
    statusIndicator: {
        position: "absolute",
        bottom: 6,
        right: 6,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#10b981",
        borderWidth: 3,
        borderColor: "#fff",
    },
    userName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0f172a",
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    userJob: {
        fontSize: 16,
        color: "#64748b",
        marginBottom: 16,
        fontWeight: "500",
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0f172a",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    editButtonActive: {
        backgroundColor: "#ef4444",
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    infoContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 12,
    },
    fieldCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    fieldHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0f172a",
        letterSpacing: 0.3,
    },
    fieldValue: {
        fontSize: 16,
        color: "#1e293b",
        fontWeight: "500",
        lineHeight: 24,
    },
    input: {
        fontSize: 16,
        color: "#0f172a",
        backgroundColor: "#f1f5f9",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1.5,
        borderColor: "#0f172a",
        fontWeight: "500",
    },
    actionContainer: {
        marginTop: 8,
        gap: 10,
    },
    saveButton: {
        flexDirection: "row",
        backgroundColor: "#10b981",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    saveText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.3,
    },
    cancelButton: {
        flexDirection: "row",
        backgroundColor: "#e2e8f0",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    cancelText: {
        color: "#0f172a",
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.3,
    },
})
