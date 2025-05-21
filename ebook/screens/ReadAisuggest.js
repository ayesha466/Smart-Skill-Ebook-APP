import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API } from '../config.js';

const Readaisuggest = () => {
    const [bookTitleInput, setBookTitleInput] = useState('');
    const [aiGeneratedBook, setAiGeneratedBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleGetAIStory = async () => {
        if (!bookTitleInput.trim()) {
            setError('Please enter a book title idea.');
            return; 
        }

        setError('');
        setLoading(true);
        setAiGeneratedBook(null);

        try {
            console.log('Sending request to generate story...');
            const response = await fetch(`${API}/api/generate-story`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: bookTitleInput }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || 'Failed to generate story');
            }

            if (!data.content) {
                throw new Error('No content received from the server');
            }

            console.log('Successfully received story');
            setAiGeneratedBook({
                title: data.title,
                content: data.content
            });
        } catch (err) {
            console.error('Error in handleGetAIStory:', err);
            setError(err.message || 'Failed to get AI story. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Story Reader</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter Ebook Title Idea:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., The Robot's Garden"
                    value={bookTitleInput}
                    onChangeText={setBookTitleInput}
                />
                <TouchableOpacity style={styles.getAIStoryButton} onPress={handleGetAIStory} disabled={loading}>
                    <Text style={styles.getAIStoryButtonText}>{loading ? 'Fetching Story...' : 'Get AI Story'}</Text>
                </TouchableOpacity>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <ScrollView style={styles.bookContainer}>
                {loading && <ActivityIndicator size="large" color="#510851" />}
                {aiGeneratedBook && (
                    <View>
                        <Text style={styles.bookTitle}>{aiGeneratedBook.title}</Text>
                        <Text style={styles.bookContent}>{aiGeneratedBook.content}</Text>
                    </View>
                )}
                {!loading && !aiGeneratedBook && !error && (
                    <Text style={styles.infoText}>Enter an ebook title idea and tap 'Get AI Story' to read an AI-generated narrative.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Light gray background
    },
    header: {
        backgroundColor: '#510851', // Dark purple header
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 15,
    },
    inputContainer: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: '#e0e0e0', // Slightly darker gray input area
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333', // Dark text
    },
    input: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    getAIStoryButton: {
        backgroundColor: '#510851', // Dark purple button
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    getAIStoryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bookContainer: {
        flex: 1,
        padding: 20,
    },
    bookTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#510851', // Dark purple title
        textAlign: 'center',
    },
    bookContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444', // Slightly lighter dark text for content
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Readaisuggest;