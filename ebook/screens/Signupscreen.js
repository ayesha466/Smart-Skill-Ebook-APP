import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ImageBackground, // Import ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { API } from '../config.js';

const Signupscreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Step 1: Validate form input
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please complete all required fields to sign up.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Step 2: Call the backend signup API
      const response = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          username,
          email,
          password,
        }),
      });
  
      // Step 3: Handle the response from the backend
      const data = await response.json();
      setLoading(false);
  
      if (response.status === 201) {
        // Signup success - navigate to Login screen
        Alert.alert('Success', 'Signup successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Loginscreen') },
        ]);
      } else if (response.status === 400) {
        // Username or email already exists
        Alert.alert('Error', data.error || 'Username or email already exists.');
      } else {
        // Other errors (server or generic issues)
        Alert.alert('Error', data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      // Step 4: Handle network or unexpected errors
      setLoading(false);
      console.error('Signup Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };
  
  

  return (
    <ImageBackground source={require('../assets/mainbgscreen.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Loginscreen')}>
            <Text style={styles.tabText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.activeTab}>Signup</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Icon name="envelope" size={20} color="#666" />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Signup</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Loginscreen')}>
              <Text style={styles.loginLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216, 191, 216, 0.8)', // Semi-transparent background
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
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
  input: {
    flex: 1,
    height: 50,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  button: {
    width: '60%',
    backgroundColor: '#510851',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 15,
  },
  loginLink: {
    color: '#8E24AA',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Signupscreen;