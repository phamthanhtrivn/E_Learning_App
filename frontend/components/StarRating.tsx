import {
    View,

    StyleSheet,

} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const StarRating = ({ value }: { value: number }) => (
    <View style={styles.row}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
                key={i}
                name={i < Math.round(value) ? 'star' : 'star-outline'}
                size={16}
                color="#facc15"
            />
        ))}
    </View>
);

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
});

export default StarRating;