import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { UserProfile, counts } from '../screens/UserProfileScreen';
type ProfileHeaderProps = {
    user: UserProfile;

};
const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <TouchableOpacity>
                    <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity> */}
            </View>

            <View style={styles.bannerContainer}>
                <Image
                    source={{ uri: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800' }}
                    style={styles.banner}
                />
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: user.avatar || user.profilePicture }}
                        style={styles.avatar}
                    />

                </View>

            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userJob}>{user.job}</Text>
            </View>




        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    menuIcon: {
        fontSize: 24,
        color: '#000',
        fontWeight: '600',
    },
    bannerContainer: {
        position: 'relative',
        height: 180,
        marginHorizontal: 20,
        marginBottom: 60,
    },
    banner: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: -50,
        alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#87CEEB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#fff',
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    userInfo: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    userJob: {
        fontSize: 14,
        color: '#888',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        paddingBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#888',
    },
});

export default ProfileHeader;
