import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Trendingbooks = () => {
    const navigation = useNavigation();

    const trendingBooks = [
        {
            id: 1,
            title: 'The Silent Patient',
            author: 'Alex Michaelides',
            description: 'A psychological thriller about a woman who shoots her husband and then stops speaking.',
            coverImage: require('../assets/silent_patient.jpg'),
            content: require('../assets/books/silent_patient.json'),
            views: 1500
        },
        {
            id: 2,
            title: 'Where the Crawdads Sing',
            author: 'Delia Owens',
            description: 'A murder mystery and coming-of-age story set in the marshes of North Carolina.',
            coverImage: require('../assets/crawdads.webp'),
            content: require('../assets/books/crawdads.json'),
            views: 1200
        },
        {
            id: 3,
            title: 'Project Hail Mary',
            author: 'Andy Weir',
            description: 'A lone astronaut must save the earth from disaster in this science fiction adventure.',
            coverImage: require('../assets/project_hail_mary.jpg'),
            content: require('../assets/books/hail_mary.json'),
            views: 1000
        }
    ];

    const handleBookPress = (book) => {
        navigation.navigate('ReadBook', { book });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Trending Books</Text>
            </View>
            <ScrollView style={styles.contentContainer}>
                {trendingBooks.map((book) => (
                    <TouchableOpacity 
                        key={book.id} 
                        style={styles.bookCard}
                        onPress={() => handleBookPress(book)}
                    >
                        <Image source={book.coverImage} style={styles.bookCover} />
                        <View style={styles.bookInfo}>
                            <Text style={styles.bookTitle}>{book.title}</Text>
                            <Text style={styles.bookAuthor}>{book.author}</Text>
                            <Text style={styles.bookDescription} numberOfLines={2}>
                                {book.description}
                            </Text>
                            <Text style={styles.viewsText}>👁️ {book.views} views</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerContainer: {
        backgroundColor: '#510851',
        paddingVertical: 15,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'Regular',
        color: '#FFF',
        textAlign: 'left',
    },
    contentContainer: {
        padding: 16,
    },
    bookCard: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    bookCover: {
        width: 100,
        height: 150,
        marginRight: 16,
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bookAuthor: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    bookDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    viewsText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});

export default Trendingbooks;