import React, { useState } from 'react';
import { API } from '../config.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ImageBackground, 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const Loginscreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.toLowerCase(), 
          password,
        }),
      });
  
      const data = await response.json();
  
      setLoading(false);
  
      if (response.ok) {
    
        await AsyncStorage.setItem('username', username);
        Alert.alert('Success', data.message || 'Login successful!');
        navigation.navigate('Choosemodescreen');
      } else {
        Alert.alert('Error', data.error || 'Wrong credentials. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/mainbgscreen.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.tabText, styles.activeTab]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signupscreen')}>
            <Text style={styles.tabText}>Signup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Forgetpassword')}>
            <Text style={styles.forgotPassword}>Forget Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleLogin}
            disabled={loading}
          >
            <View style={styles.button}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(230, 204, 230, 0.7)', 
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  tabContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#8E24AA',
    paddingBottom: 5,
    color: '#000',
  },
  formContainer: {
    width: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#333',
    fontSize: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '60%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#510851',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Loginscreen;