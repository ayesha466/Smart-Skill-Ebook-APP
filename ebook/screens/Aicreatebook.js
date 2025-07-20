import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API } from "../config";

const { height } = Dimensions.get("window");

const Aicreatebook = () => {
  const [ebookLength, setEbookLength] = useState("Short");
  const [topic, setTopic] = useState("");
  const [keypoints, setKeypoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleGenerateEbook = async () => {
    if (!topic) {
      Alert.alert("Error", "Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/api/generate-ai-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: topic,
          length: ebookLength,
          topic,
          keypoints: keypoints.split(",").map((k) => k.trim()),
          tone: tone,
          language: language,
          category: "Non-Fiction",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate ebook");
      }

      const data = await response.json();

      if (data.success && data.book) {
        navigation.navigate("ReadBook", {
          book: data.book,
          title: data.book.title,
          content: data.book.content,
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error generating AI book:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to generate ebook. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create AI E-Book</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ebook length</Text>
          <View style={styles.lengthButtons}>
            <TouchableOpacity
              style={[
                styles.lengthButton,
                ebookLength === "Short" && styles.selectedLengthButton,
              ]}
              onPress={() => setEbookLength("Short")}
            >
              <Text
                style={[
                  styles.lengthButtonText,
                  ebookLength === "Short" && styles.selectedLengthButtonText,
                ]}
              >
                Short
              </Text>
              <Text
                style={[
                  styles.lengthButtonSubText,
                  ebookLength === "Short" && styles.selectedLengthButtonSubText,
                ]}
              >
                1800 Words
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.lengthButton,
                ebookLength === "Medium" && styles.selectedLengthButton,
              ]}
              onPress={() => setEbookLength("Medium")}
            >
              <Text
                style={[
                  styles.lengthButtonText,
                  ebookLength === "Medium" && styles.selectedLengthButtonText,
                ]}
              >
                Medium
              </Text>
              <Text
                style={[
                  styles.lengthButtonSubText,
                  ebookLength === "Medium" &&
                    styles.selectedLengthButtonSubText,
                ]}
              >
                10000 Words
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.lengthButton,
                ebookLength === "Long" && styles.selectedLengthButton,
              ]}
              onPress={() => setEbookLength("Long")}
            >
              <Text
                style={[
                  styles.lengthButtonText,
                  ebookLength === "Long" && styles.selectedLengthButtonText,
                ]}
              >
                Long
              </Text>
              <Text
                style={[
                  styles.lengthButtonSubText,
                  ebookLength === "Long" && styles.selectedLengthButtonSubText,
                ]}
              >
                20000 Words +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topic</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g., The Art of Productivity: Mastering Your Daily Routine"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keypoint</Text>
          <TextInput
            style={styles.input}
            value={keypoints}
            onChangeText={setKeypoints}
            placeholder="e.g., Strategies to stay focused, Time management techniques, Overcoming procrastination"
          />
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>+ Upload File</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tone</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{tone}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{language}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.generateButton, loading && styles.disabledButton]}
        onPress={handleGenerateEbook}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.generateButtonText}>Generate E-Book</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C8A2C8",
  },
  header: {
    backgroundColor: "#510851",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#624F62",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  lengthButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lengthButton: {
    backgroundColor: "white", 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20, 
    width: "30%",
    alignItems: "center",
    borderWidth: 1, 
    borderColor: "#4A235A", 
  },
  selectedLengthButton: {
    backgroundColor: "#C8A2C8", 
    borderColor: "#4A235A",
  },
  lengthButtonText: {
    color: "black", 
    fontSize: 16,
  },
  selectedLengthButtonText: {
    color: "white", 
  },
  lengthButtonSubText: {
    color: "gray",
    fontSize: 12,
  },
  selectedLengthButtonSubText: {
    color: "lightgray", 
  },
  input: {
    backgroundColor: "#E4EFE7",
    color: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  uploadButton: {
    backgroundColor: "#E4EFE7",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#6200EE",
  },
  dropdown: {
    backgroundColor: "#E4EFE7",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownText: {
    color: "black",
  },
  generateButton: {
    backgroundColor: "#510851",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  generateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedCategoryButton: {
    backgroundColor: "#007AFF",
  },
  categoryButtonText: {
    color: "#333",
    fontSize: 14,
  },
  selectedCategoryButtonText: {
    color: "#fff",
  },
});

export default Aicreatebook;
