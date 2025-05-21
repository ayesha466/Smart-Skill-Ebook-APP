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

const Resetpasswordscreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email, resetToken } = route.params;

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both passwords');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      console.log('Resetting password for:', email);
      console.log('Using reset token:', resetToken);

      const response = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetToken,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      const data = await response.json();
      console.log('Reset password response:', data);

      Alert.alert('Success', 'Password reset successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Loginscreen') }
      ]);
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to reset password. Please try again.',
        [{ text: 'OK' }]
      );
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
          <Image source={require("../assets/resetlogo.png")} style={styles.icon} />
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your new password</Text>

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={handleResetPassword}
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Reset Password</Text>
            )}
          </TouchableOpacity>
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
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  submitButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#510851",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default Resetpasswordscreen;