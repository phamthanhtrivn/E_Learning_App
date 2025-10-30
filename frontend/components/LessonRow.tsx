import {
    View,
    Text,
    StyleSheet,

} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
type Lesson = { title: string; duration: string; isLocked: boolean };

const LessonRow = ({ lesson, index }: { lesson: Lesson; index: number }) => (
    <View style={styles.lessonRow}>
        <View style={styles.row}>
            <Text style={styles.lessonIndex}>{String(index).padStart(2, '0')}</Text>
            <View>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <View style={styles.row}>
                    <Feather name="clock" size={12} color="#888" />
                    <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                </View>
            </View>
        </View>
        {lesson.isLocked ? (
            <Feather name="lock" size={16} color="#ccc" />
        ) : (
            <Feather name="play" size={16} color="#7c3aed" />
        )}
    </View>
);
const styles = StyleSheet.create({
    lessonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
    },
    lessonIndex: { width: 30, color: '#888', fontSize: 12 },
    lessonTitle: { fontSize: 13, fontWeight: '500' },
    lessonDuration: { fontSize: 11, color: '#666', marginLeft: 4 },
    row: { flexDirection: 'row', alignItems: 'center' },

});
export default LessonRow;
