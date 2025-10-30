import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StarRating from './StarRating';

type Review = {
    userId: { name: string; avatar: string };
    rating: number;
    comment: string;
};

const ReviewItem = ({ review }: { review: Review }) => (
    <View style={styles.reviewCard}>
        {/* Hàng đầu: avatar + tên + rating */}
        <View style={styles.headerRow}>
            <Image
                source={{ uri: review.userId.avatar }}
                style={styles.avatar}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.reviewUser}>{review.userId.name}</Text>
                <StarRating value={review.rating} />
            </View>
        </View>

        {/* Comment */}
        <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
);

const styles = StyleSheet.create({
    reviewCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    reviewUser: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    reviewComment: {
        fontSize: 13,
        color: '#444',
        lineHeight: 18,
        marginTop: 2,
        paddingLeft: 2,
    },
});

export default ReviewItem;
