import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import bg from '../assets/choosemodebg.png';
import { useNavigation } from '@react-navigation/native';

const Choosemodescreen = () => {
  const navigation = useNavigation(); 

  const handleReadBook = () => {
    navigation.navigate('Bookreadscreen'); 
  };
  const handleWriteBook = () => {
    navigation.navigate('Bookwritescreen'); 
  };

  return (
    <ImageBackground source={bg} style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Loginscreen')}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profilescreen')}>
          <Image
            source={require('../assets/profilelogo.png')}
            style={styles.profileLogo}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Image
          source={require('../assets/dashboardlogo.png')}
          style={styles.mainLogo}
        />
        <Text style={[styles.welcomeText, { color: 'Black', fontWeight: 'bold' }]}>
          Welcome back, Ayesha!
        </Text>
        <Text style={[styles.quoteText, { fontSize: 16 }]}>
          Every great story starts with a page. 📖✨
        </Text>
      </View>

      {/* Choose Mode Section */}
      <View style={styles.modeSection}>
        <Text style={[styles.chooseModeText, { color: '#090448', textAlign: 'center' }]}>
          CHOOSE YOUR MODE
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleReadBook}> {/* Added onPress */}
            <Text style={styles.buttonText}>Read Book</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleWriteBook}> {/* Added onPress */}
            <Text style={styles.buttonText}>Write Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  profileLogo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  content: {
    alignItems: 'center',
    marginTop: 50,
  },
  mainLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 30,
    marginTop: 20,
  },
  quoteText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modeSection: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  chooseModeText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#510851',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Choosemodescreen;