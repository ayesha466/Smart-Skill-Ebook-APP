// Bookwritescreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../component/Sidebar';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => size * scale;

const Bookwritescreen = () => {
    const navigation = useNavigation();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const sidebarAnim = useState(new Animated.Value(-300))[0];

    const toggleSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: isSidebarVisible ? -300 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setSidebarVisible(!isSidebarVisible));
    };

    const handleEbookTitlePress = () => {
        navigation.navigate('Ebooktitle');
    };

    const handleBeginWritingPress = () => {
        navigation.navigate('Beginwrite'); // Updated navigation to 'Beginwrite'
    };

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

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Aicreatebook')}>
                    <Text style={styles.buttonText}>AI Create Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleEbookTitlePress}>
                    <Text style={styles.buttonText}>Ebook Title</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.beginWritingButton} onPress={handleBeginWritingPress}>
                <Text style={styles.beginWritingButtonText}>Begin Writing</Text>
            </TouchableOpacity>

            <View style={styles.Containertemplates}>
                <Text style={styles.templatesTitle}>Templates</Text>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity style={styles.templateItem}>
                        <Image source={require('../assets/personal_development.png')} style={styles.templateIcon} />
                        <Text style={styles.templateText}>Ebook on Personal Development</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.templateItem}>
                        <Image source={require('../assets/health_wellness.png')} style={styles.templateIcon} />
                        <Text style={styles.templateText}>Ebook on Health & Wellness</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.templateItem}>
                        <Image source={require('../assets/diet.png')} style={styles.templateIcon} />
                        <Text style={styles.templateText}>Healthy & Special diet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.templateItem}>
                        <Image source={require('../assets/education.png')} style={styles.templateIcon} />
                        <Text style={styles.templateText}>Education & Academics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.templateItem}>
                        <Image source={require('../assets/culture.png')} style={styles.templateIcon} />
                        <Text style={styles.templateText}>Cultural & Heritage ebook</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.bottomNav}>
                <TouchableOpacity 
                    style={styles.navButton} 
                    onPress={() => navigation.navigate('Choosemodescreen')}
                >
                    <Text style={styles.navButtonText}>⬅️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Text style={styles.navButtonText}>🏠</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Profilescreen')}
                >
                    <Image source={require('../assets/profile.png')} style={styles.profileIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E2E8',
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
    buttonContainer: {
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
        fontSize: normalize(15),
        fontWeight: 'regular',
    },
    beginWritingButton: {
        backgroundColor: '#624F62',
        paddingTop: normalize(15),
        paddingBottom: normalize(15),
        borderRadius: normalize(20),
        fontSize: normalize(20),
        alignItems: 'center',
        marginTop: normalize(10),
        width: '80%',
        marginLeft: normalize(35),
    },
    beginWritingButtonText: {
        color: 'white',
        fontWeight: 'regular',
        fontSize: normalize(20),
        textAlign: 'center',
    },
    Containertemplates: {
        flex: 1,
        marginTop: normalize(40),
        paddingHorizontal: normalize(15),
    },
    scrollContent: {
        paddingVertical: normalize(10),
        paddingBottom: normalize(100),
    },
    templatesTitle: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        marginBottom: normalize(20),
    },
    templateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(15),
        marginVertical: normalize(8),
        backgroundColor: '#fff',
        borderRadius: normalize(10),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: normalize(2),
        },
        shadowOpacity: 0.1,
        shadowRadius: normalize(3),
        elevation: 3,
    },
    templateIcon: {
        width: normalize(30),
        height: normalize(30),
        marginRight: normalize(10),
    },
    templateText: {
        fontSize: normalize(16),
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: normalize(10),
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginTop: normalize(20),
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
});

export default Bookwritescreen;