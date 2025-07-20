import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => size * scale;

const Beginwrite = () => {
    const [bookTitle, setBookTitle] = useState('');
    const [bookContent, setBookContent] = useState('');
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState('');

    const navigation = useNavigation();

    const handleAddChapter = () => {
        if (currentChapter.trim()) {
            setChapters([...chapters, currentChapter]);
            setCurrentChapter('');
        }
    };

    const handleSave = () => {

        console.log({
            title: bookTitle,
            content: bookContent,
            chapters: chapters,
        });
        alert('Book Saved!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Write Your Book</Text>
            </View>
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.label}>Enter your book's title:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Book Title"
                    value={bookTitle}
                    onChangeText={setBookTitle}
                />

                <Text style={styles.label}>Begin writing your story:</Text>
                <TextInput
                    style={styles.contentInput}
                    placeholder="Start writing your book..."
                    multiline
                    value={bookContent}
                    onChangeText={setBookContent}
                />

                <Text style={styles.chapterTitle}>Chapters</Text>
                <View style={styles.chapterInputContainer}>
                    <TextInput
                        style={styles.chapterInput}
                        placeholder="Add Chapter Title"
                        value={currentChapter}
                        onChangeText={setCurrentChapter}
                    />
                    <TouchableOpacity style={styles.addChapterButton} onPress={handleAddChapter}>
                        <Text style={styles.addChapterButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {chapters.map((chapter, index) => (
                    <View key={index} style={styles.chapterItem}>
                        <Text>{chapter}</Text>
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Book</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C8A2C8',
    },
    header: {
        backgroundColor: '#510851',
        paddingTop: 20,
        paddingBottom: normalize(15),
        paddingHorizontal: normalize(15),
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: normalize(15),
    },
    headerTitle: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        color: 'white',
    },
    contentContainer: {
        flex: 1, 
        padding: normalize(20),
        paddingTop: normalize(20) + normalize(15) + 20, 
    },
    label: {
        fontSize: normalize(16),
        fontWeight: 'bold',
        marginBottom: normalize(5),
        color: '#333',
    },
    title: {
        fontSize: normalize(24),
        fontWeight: 'bold',
        marginBottom: normalize(20),
    },
    input: {
        backgroundColor: '#fff',
        padding: normalize(15),
        marginBottom: normalize(15), 
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#ccc',
    },
    contentInput: {
        backgroundColor: '#fff',
        padding: normalize(15),
        marginBottom: normalize(20),
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#ccc',
        minHeight: normalize(150),
        textAlignVertical: 'top',
    },
    chapterTitle: {
        fontSize: normalize(18),
        fontWeight: 'bold',
        marginTop: normalize(20),
        marginBottom: normalize(10),
    },
    chapterInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    chapterInput: {
        flex: 1,
        backgroundColor: '#fff',
        padding: normalize(10),
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: normalize(10),
    },
    addChapterButton: {
        backgroundColor: '#510851', 
        padding: normalize(10),
        borderRadius: normalize(8),
    },
    addChapterButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    chapterItem: {
        backgroundColor: '#C8A2C8', 
        padding: normalize(15),
        marginBottom: normalize(8),
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#510851', 
    },
    saveButton: {
        backgroundColor: '#510851',
        padding: normalize(15),
        borderRadius: normalize(8),
        alignItems: 'center',
        marginHorizontal: normalize(20),
        marginBottom: normalize(20),
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Beginwrite;