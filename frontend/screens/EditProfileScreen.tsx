import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation, route }: any) {
    // Nhận dữ liệu user hiện tại (có thể truyền qua navigation)
    const currentUser = route?.params?.user || {
        name: "Nguyễn Văn A",
        email: "vana@example.com",
        job: "Mobile Developer",
        phone: "0123456789",
        avatar:
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    };

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [job, setJob] = useState(currentUser.job);
    const [phone, setPhone] = useState(currentUser.phone);
    const [avatar, setAvatar] = useState(currentUser.avatar);
    const [isSaving, setIsSaving] = useState(false);

    // Chọn ảnh đại diện mới
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    // Hàm lưu dữ liệu (giả lập gọi API)
    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert("Lỗi", "Tên và Email không được để trống!");
            return;
        }

        setIsSaving(true);

        try {
            // Gọi API PUT: /api/users/:id (ví dụ)
            // await updateUser(currentUser._id, { name, email, job, phone, avatar });
            setTimeout(() => {
                setIsSaving(false);
                Alert.alert("Thành công", "Cập nhật thông tin thành công!");
                navigation.goBack();
            }, 1200);
        } catch (err) {
            setIsSaving(false);
            Alert.alert("Lỗi", "Không thể lưu thông tin, vui lòng thử lại.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Ảnh đại diện */}
            <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <View style={styles.editIcon}>
                        <Ionicons name="camera" size={18} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Form chỉnh sửa */}
            <View style={styles.form}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập họ tên"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: "#f3f4f6" }]}
                    value={email}
                    editable={false}
                />

                <Text style={styles.label}>Nghề nghiệp</Text>
                <TextInput
                    style={styles.input}
                    value={job}
                    onChangeText={setJob}
                    placeholder="VD: Lập trình viên"
                />

                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="Nhập số điện thoại"
                />

                <TouchableOpacity
                    style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <Text style={styles.saveText}>
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    avatarContainer: { alignItems: "center", marginTop: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#7c3aed",
        borderRadius: 15,
        padding: 5,
    },
    form: { marginTop: 30 },
    label: { fontSize: 14, color: "#333", marginBottom: 4, fontWeight: "500" },
    input: {
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: "#7c3aed",
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: "center",
    },
    saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
