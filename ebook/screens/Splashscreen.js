import React from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png';
import { useNavigation } from '@react-navigation/native'; 

const SplashScreen = () => {
  const navigation = useNavigation(); 

  const handleLogoPress = () => {
    navigation.navigate('Getstarted'); 
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={handleLogoPress}>
          <View style={styles.circle}>
            <Image source={logo} style={styles.logoImage} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});

export default SplashScreen;