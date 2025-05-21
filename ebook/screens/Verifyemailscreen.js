import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API } from '../config';

const Verifyemailscreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const handleOtpChange = (text, index) => {
    if (text.length <= 1) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input
      if (text.length === 1 && index < 5) {
        // Find the next input and focus it
        const nextInput = index + 1;
        const inputRef = `otpInput${nextInput}`;
        if (this[inputRef]) {
          this[inputRef].focus();
        }
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying OTP for email:', email);
      console.log('OTP being verified:', enteredOtp);

      const response = await fetch(`${API}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await response.json();
      console.log('Verification response:', data);

      if (response.ok) {
        navigation.navigate('Resetpasswordscreen', { 
          email,
          resetToken: data.resetToken 
        });
      } else {
        Alert.alert('Error', data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'New OTP has been sent to your email');
        // Clear existing OTP
        setOtp(["", "", "", "", "", ""]);
      } else {
        Alert.alert('Error', data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/mainbgscreen.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.header}>Smart AI Ebook</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.contentContainer}>
          <Image source={require("../assets/verifylogo.png")} style={styles.icon} />
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>Enter the 6-digit verification code</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => this[`otpInput${index}`] = ref}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
              />
            ))}
          </View>

          <TouchableOpacity 
            onPress={handleSubmit} 
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.resendText}>
            Didn't receive the OTP?
            <Text onPress={handleResendOtp} style={styles.resendLink}>
              {" "}
              Resend OTP
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(245, 231, 255, 0.8)",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#999",
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  submitButton: {
    width: "40%",
    paddingVertical: 12,
    backgroundColor: "#510851",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendText: {
    fontSize: 14,
    color: "#555",
  },
  resendLink: {
    color: "#6A11CB",
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default Verifyemailscreen;