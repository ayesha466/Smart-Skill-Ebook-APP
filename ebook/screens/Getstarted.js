import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/getstartedlogo.png';
import bgImage from '../assets/mainbgscreen.jpg';
import { useFonts } from 'expo-font';

const Getstarted = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    'Aclonica-Regular': require('../assets/fonts/Aclonica-Regular.ttf'), // Load the font
  });

  const handleGetStarted = () => {
    navigation.navigate('Loginscreen');
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    ); // Show loading indicator while font is loading
  }

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logoImage} />
          <Text style={styles.title}>Smart AI Building</Text>
          <Text style={styles.subtitle}>E-Book</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.description}>
            Create, Read, and Learn with AI-powered e-books. Your skill-building journey starts here!
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(230, 204, 230, 0.7)',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Roboto', // Use the loaded font
    color: '#000000',
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'InknutAntiqua-Bold',
  },
  textContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 32,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'InknutAntiqua-Bold',
  },
  button: {
    backgroundColor: '#510851',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'InknutAntiqua-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Getstarted;