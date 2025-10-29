import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import LessonRow from './LessonRow';
type Lesson = { title: string; duration: string; isLocked: boolean };

type Section = { title: string; order: number; lessons: Lesson[] };

const SectionAccordion = ({ section }: { section: Section }) => {
    const [open, setOpen] = useState(section.order === 1);
    return (
        <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setOpen(!open)}>
                <Text style={styles.sectionTitle}>
                    {section.order}. {section.title}
                </Text>
                <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#555" />
            </TouchableOpacity>
            {open && section.lessons.map((l, i) => <LessonRow key={i} lesson={l} index={i + 1} />)}
        </View>
    );
};
const styles = StyleSheet.create({
    sectionContainer: { marginBottom: 12 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    sectionTitle: { fontWeight: '600', color: '#000' }
});
export default SectionAccordion;