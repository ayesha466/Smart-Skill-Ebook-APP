import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API } from '../config';

const Forgetpassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending OTP request to:', `${API}/forgot-password`);
      console.log('Request body:', { email });

      const response = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        Alert.alert('Success', 'OTP has been sent to your email');
        navigation.navigate('Verifyemailscreen', { email });
      } else {
        Alert.alert('Error', data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
     
      if (error.message === 'Network request failed') {
        Alert.alert(
          'Network Error',
          'Please check your internet connection and make sure the server is running.',
          [
            {
              text: 'Try Again',
              onPress: () => handleSendOTP(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/mainbgscreen.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Header Container */}
        <View style={styles.headerContainer}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, { color: '#000' }]}>Smart AI Ebook</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Lock Icon */}
          <View style={styles.lockIconContainer}>
            <Image source={require('../assets/forget.png')} style={styles.lockIcon} />
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Forgot Your Password?</Text>
          <Text style={styles.subText}>
            Enter your email to receive a reset OTP.
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#BDBDBD"
            />
            <Icon name="envelope" size={20} color="#BDBDBD" />
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backToLoginContainer}
          >
            <Icon
              name="arrow-left"
              size={12}
              color="#fff"
              style={styles.backToLoginIcon}
            />
            <Text style={styles.backToLogin}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(245, 225, 245, 0.9)',
    paddingTop: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  lockIconContainer: {
    backgroundColor: 'rgba(128, 0, 128, 0.2)',
    borderRadius: 80,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  lockIcon: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 35,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(204, 204, 204, 0.3)',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50, 
    fontSize: 16, 
    color: '#333',
  },
  button: {
    width: '80%', 
    backgroundColor: '#800080',
    paddingVertical: 15, 
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, 
    fontWeight: 'bold',
  },
  backToLoginContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToLogin: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  backToLoginIcon: {
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default Forgetpassword;
