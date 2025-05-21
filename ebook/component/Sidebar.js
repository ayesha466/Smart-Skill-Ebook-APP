import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Sidebar = ({ sidebarAnim, isSidebarVisible }) => {
    const navigation = useNavigation();

    return (
        <Animated.View
            style={[
                styles.sidebar,
                { transform: [{ translateX: sidebarAnim }] },
            ]}
        >
            <View>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Bookreadscreen')}>
                    <Icon name="home" size={20} color="#333" style={styles.sidebarIcon} />
                    <Text style={styles.sidebarText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Icon name="share-alt" size={20} color="#333" style={styles.sidebarIcon} />
                    <Text style={styles.sidebarText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Icon name="save" size={20} color="#333" style={styles.sidebarIcon} />
                    <Text style={styles.sidebarText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Icon name="star" size={20} color="#333" style={styles.sidebarIcon} />
                    <Text style={styles.sidebarText}>Rate us</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Icon name="trash" size={20} color="#333" style={styles.sidebarIcon} />
                    <Text style={styles.sidebarText}>Trash</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutItem}>
                <Icon name="sign-out" size={20} color="#333" style={styles.sidebarIcon} />
                <Text style={styles.sidebarText}>Logout</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 250, // Increased width
        height: '100%',
        backgroundColor: '#D8BFD8',
        paddingTop: 20,
        paddingHorizontal: 20,
        zIndex: 10,
        justifyContent: 'space-between',
        shadowColor: '#000', // Added shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 20,
    },
    sidebarIcon: {
        marginRight: 10,
    },
    sidebarText: {
        fontSize: 16,
    },
});

export default Sidebar;