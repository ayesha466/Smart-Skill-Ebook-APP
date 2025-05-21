import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API } from "../config";
const { height } = Dimensions.get("window");

const Aireadbook = ({ route }) => {
  const {
    bookTitle: initialBookTitle = "Discover AI Books",
    bookContent:
      initialBookContent = "Explore AI-generated content based on your interests.",
  } = route.params || {};

  const [selectedGenre, setSelectedGenre] = useState("AI & Technology");
  const [recommendedBooks, setRecommendedBooks] = useState([
    {
      title: "Artificial Intelligence for Beginners",
      genre: "AI & Technology",
    },
    { title: "The Rise of Machines", genre: "AI & Technology" },
    { title: "Deep Learning Secrets", genre: "AI & Technology" },
    { title: "History of Space Exploration", genre: "History" },
    { title: "The Psychology of Success", genre: "Self-Development" },
    { title: "The Cyberpunk City", genre: "Fiction" },
    { title: "Whispers of the Forgotten Forest", genre: "Fiction" },
    { title: "The Last Starship", genre: "Fiction" },
    { title: "Atomic Habits", genre: "Self-Development" }, // Added Self-Development book
    { title: "World War II: A Global History", genre: "History" }, // Added History book
  ]);

  const [selectedBookText, setSelectedBookText] = useState(initialBookTitle);
  const [isSelectBookEditable, setIsSelectBookEditable] = useState(false);

  const [bookContentText, setBookContentText] = useState(initialBookContent);
  const [isBookContentEditable, setIsBookContentEditable] = useState(false);

  const navigation = useNavigation();

  const getFilteredBooks = () => {
    return recommendedBooks.filter((book) => book.genre === selectedGenre);
  };

  const handleGenerateBook = async () => {
    try {
      console.log("Generating book with:", {
        genre: selectedGenre,
        title: selectedBookText,
      });

      const response = await fetch(`${API}/api/generate-ai-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedBookText,
          length: "Short",
          topic: selectedBookText,
          keypoints: [selectedGenre],
          tone: "Formal",
          language: "English",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate book content");
      }

      const data = await response.json();
      console.log("Raw API Response:", JSON.stringify(data, null, 2));

      // Check if we have a valid book response
      if (data.success && data.book) {
        const { book } = data;
        console.log("Generated book:", book);
        
        // Navigate to ReadBook with the generated content
        navigation.navigate("ReadBook", {
          book: {
            title: book.title,
            content: book.content,
            author: "AI Generated",
            pdfUrl: book.pdfUrl
          }
        });
      } else {
        throw new Error("Invalid response format from server");
      }

      console.log("Successfully generated book content");
    } catch (error) {
      console.error("Error generating book:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to generate book content. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Bookreadscreen")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Read Book</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.genreContainer}>
          <Text style={[styles.label, styles.blackText]}>Choose Genre:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["AI & Technology", "History", "Self-Development", "Fiction"].map(
              (genre) => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreButton,
                    selectedGenre === genre && styles.selectedGenre,
                    selectedGenre === genre && styles.selectedButtonColor,
                  ]}
                  onPress={() => setSelectedGenre(genre)}
                >
                  <Text style={styles.genreText}>{genre}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        <View style={styles.recommendContainer}>
          <Text style={[styles.label, styles.blackText]}>
            Recommended Books
          </Text>
          {getFilteredBooks().map((book, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bookItem}
              onPress={() => setSelectedBookText(book.title)} // Set selected book on tap
            >
              <Ionicons name="book-outline" size={20} color="#4A235A" />
              <Text style={styles.bookTitle}>{book.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, styles.blackText]}>Selected Book</Text>
          <TouchableOpacity onPress={() => setIsSelectBookEditable(true)}>
            <View style={styles.inputBox}>
              {isSelectBookEditable ? (
                <TextInput
                  style={styles.inputText}
                  value={selectedBookText}
                  onChangeText={setSelectedBookText}
                  onBlur={() => setIsSelectBookEditable(false)}
                />
              ) : (
                <Text style={styles.inputText}>{selectedBookText}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, styles.blackText]}>Book Content</Text>
          <View style={styles.contentBox}>
            <ScrollView style={styles.contentScroll}>
              <Text style={styles.contentText}>
                {bookContentText
                  ? bookContentText.split("\n").map((line, index) => {
                      if (line.startsWith("##")) {
                        return (
                          <Text key={index} style={styles.chapterTitle}>
                            {line.replace("##", "").trim()}
                          </Text>
                        );
                      } else if (line.startsWith("*")) {
                        return (
                          <Text key={index} style={styles.listItem}>
                            {line.replace("*", "•").trim()}
                          </Text>
                        );
                      } else if (line.startsWith("**")) {
                        return (
                          <Text key={index} style={styles.boldText}>
                            {line.replace(/\*\*/g, "").trim()}
                          </Text>
                        );
                      } else {
                        return (
                          <Text key={index} style={styles.paragraph}>
                            {line}
                          </Text>
                        );
                      }
                    })
                  : "No content generated yet. Click 'Generate Book' to create content."}
              </Text>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateBook}
        >
          <Text style={styles.generateButtonText}>Generate Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#C8A2C8",
  },
  header: {
    backgroundColor: "#510851",
    padding: 10,
    marginBottom: 30, // Increased marginBottom to create space
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "Regular",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  contentContainer: {
    flexGrow: 1,
    // justifyContent: "center", // Removed justifyContent center
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: height * 0.03, // Reduced vertical padding
  },
  genreContainer: {
    marginBottom: height * 0.03, // Reduced marginBottom
    width: "100%",
  },
  genreButton: {
    backgroundColor: "#F8F8F8",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#4A235A",
  },
  selectedGenre: {
    backgroundColor: "#4A235A",
  },
  genreText: {
    fontSize: 14,
    color: "#4A235A",
    fontWeight: "bold",
  },
  recommendContainer: {
    marginBottom: height * 0.03, // Reduced marginBottom
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  bookTitle: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  inputContainer: {
    marginBottom: height * 0.03, // Reduced marginBottom
    width: "100%",
  },
  inputBox: {
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 8,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  contentBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    minHeight: 200,
    maxHeight: 400,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  contentScroll: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A235A",
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    marginBottom: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: "#510851",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedButtonColor: {
    backgroundColor: "#D8BFD8",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  blackText: {
    color: "black",
  },
});

export default Aireadbook;
