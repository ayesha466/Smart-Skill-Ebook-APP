import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error loading username:', error);
      }
    };

    loadUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      navigation.navigate('Loginscreen');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleResetPassword = () => {
    navigation.navigate('Forgetpassword');
  };

  return (
    <ImageBackground
      source={require('../assets/profilebg.jpeg')}
      style={styles.background}
      imageStyle={{ opacity: 0.6 }}
    >
      <View style={styles.container}>
        {/* Back Icon */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/iconpro.png')}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{username || 'User'}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Setting</Text>
            <Icon name="chevron-right" size={20} color="#fff" style={styles.chevronIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notification</Text>
            <Icon name="chevron-right" size={20} color="#fff" style={styles.chevronIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleResetPassword}>
            <Text style={styles.settingText}>Change Password</Text>
            <Icon name="chevron-right" size={20} color="#fff" style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="sign-out" size={22} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  settingsContainer: {
    marginBottom: 50,
    backgroundColor: 'rgba(63, 62, 62, 0.4)',
    borderRadius: 15,
    padding: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'space-between',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
  },
  chevronIcon: {
    color: '#fff',
  },
  logoutContainer: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  logoutButton: {
    backgroundColor: 'rgba(105, 40, 105, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 30, 
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 10,
    color: '#fff',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileScreen;
