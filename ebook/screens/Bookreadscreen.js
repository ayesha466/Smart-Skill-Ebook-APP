import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Animated, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '../component/Sidebar';
import { API } from '../config';

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => size * scale;

const Bookreadscreen = () => {
    const navigation = useNavigation();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [trendingBooks, setTrendingBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const sidebarAnim = useState(new Animated.Value(-width * 0.8))[0];

    useEffect(() => {
        fetchCategories();
        fetchTrendingBooks();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API}/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTrendingBooks = async () => {
        try {
            const response = await fetch(`${API}/trending-books`);
            const data = await response.json();
            setTrendingBooks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trending books:', error);
            setLoading(false);
        }
    };

    const handleCategoryPress = (category) => {
        navigation.navigate('CategoryBooks', { category });
    };

    const toggleSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: isSidebarVisible ? -width * 0.8 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setSidebarVisible(!isSidebarVisible));
    };

    const handleEbookTitlePress = () => {
        navigation.navigate('Readaisuggest');
    };

    const handleTrendingBooksPress = () => {
        navigation.navigate('Trendingbooks', { books: trendingBooks });
    };

    // Map category titles to their corresponding image assets
    const getCategoryImage = (title) => {
        switch (title) {
            case 'Non-Fiction':
                return require('../assets/nonfiction.png');
            case 'Travel & Exploration':
                return require('../assets/travel.png');
            case 'Urdu Novel':
                return require('../assets/urdu.png');
            case "Children's Books":
                return require('../assets/children.png');
            case 'Quran Stories':
                return require('../assets/quran.png');
            case 'Fiction':
                return require('../assets/fiction.png');
            default:
                return require('../assets/default.png');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#624F62" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Sidebar sidebarAnim={sidebarAnim} isSidebarVisible={isSidebarVisible} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.menuIcon} onPress={toggleSidebar}>
                    {isSidebarVisible ? (
                        <Icon name="times" size={normalize(25)} color="#333" />
                    ) : (
                        <View style={styles.hamburger}>
                            <View style={styles.hamburgerLine} />
                            <View style={styles.hamburgerLine} />
                            <View style={styles.hamburgerLine} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('Aireadbook')}
                >
                    <Text style={styles.buttonText}>AI Read Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleEbookTitlePress}>
                    <Text style={styles.buttonText}>Ebook Title</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.trendingBooksButton} 
                onPress={handleTrendingBooksPress}
            >
                <Text style={styles.trendingBooksText}>Trending Books</Text>
            </TouchableOpacity>

            <Text style={styles.categoryTitle}>Category</Text>

            <ScrollView
                contentContainerStyle={styles.categoryGrid}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {categories.map(category => (
                    <TouchableOpacity 
                        key={category.id} 
                        style={styles.categoryItem}
                        onPress={() => handleCategoryPress(category.title)}
                    >
                        <View style={styles.categoryImageContainer}>
                            <Image 
                                source={getCategoryImage(category.title)}
                                style={styles.categoryImage}
                            />
                        </View>
                        <Text style={styles.categoryText}>{category.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Choosemodescreen")}>
                    <Text style={styles.navButtonText}>⬅️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Bookreadscreen")}>
                    <Text style={styles.navButtonText}>🏠</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profilescreen")}>
                    <Image source={require('../assets/profile.png')} style={styles.profileIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6E0EB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: normalize(10),
        paddingTop: Platform.OS === 'ios' ? normalize(50) : normalize(10),
    },
    menuIcon: {
        padding: normalize(5),
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: normalize(20),
        paddingHorizontal: normalize(25),
    },
    button: {
        backgroundColor: '#624F62',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(20),
        borderRadius: normalize(20),
        width: normalize(150),
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'regular',
        fontSize: normalize(15),
    },
    trendingBooksButton: {
        backgroundColor: '#624F62',
        paddingTop: normalize(15),
        paddingBottom: normalize(15),
        fontSize: normalize(20),
        borderRadius: normalize(20),
        alignSelf: 'center',
        marginTop: normalize(10),
        width: '80%',
    },
    trendingBooksText: {
        color: 'white',
        fontWeight: 'regular',
        fontSize: normalize(20),
        textAlign: 'center',
    },
    categoryTitle: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        marginTop: normalize(20),
        marginLeft: normalize(10),
        marginBottom: normalize(4),
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: normalize(10),
        paddingBottom: normalize(100),
    },
    categoryItem: {
        width: '45%',
        marginBottom: normalize(20),
        alignItems: 'center',
    },
    categoryImageContainer: {
        width: '100%',
        alignItems: 'center',
    },
    categoryImage: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius: normalize(10),
        resizeMode: 'cover',
    },
    categoryText: {
        textAlign: 'left',
        marginTop: normalize(5),
        fontSize: normalize(14),
        width: '100%',
        paddingLeft: normalize(5),
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: normalize(10),
        borderTopWidth: 1,
        borderTopColor: '#E0D0EB',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#E6E0EB',
    },
    navButton: {
        padding: normalize(10),
    },
    navButtonText: {
        fontSize: normalize(24),
    },
    profileIcon: {
        width: normalize(30),
        height: normalize(30),
    },
    hamburger: {
        width: normalize(25),
        height: normalize(20),
        justifyContent: 'space-around',
    },
    hamburgerLine: {
        width: '100%',
        height: normalize(3),
        backgroundColor: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6E0EB',
    },
});

export default Bookreadscreen;