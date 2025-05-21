import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ReadBook = () => {
  const [fontSize, setFontSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const loadBook = () => {
      try {
        const { book: bookData, title, content } = route.params;

        if (!bookData && !content) {
          throw new Error("No book data provided");
        }

        // Handle both direct content and book object
        const bookContent = bookData?.content || content;
        const bookTitle = bookData?.title || title;

        if (!bookContent) {
          console.error("Book data received:", { bookData, title, content });
          throw new Error("No content found in book data. Please ensure the book has content before opening.");
        }

        // Ensure content is a string and handle different content formats
        let processedContent;
        if (typeof bookContent === 'object') {
          if (bookContent.text) {
            processedContent = bookContent.text;
          } else if (bookContent.content) {
            processedContent = bookContent.content;
          } else {
            processedContent = JSON.stringify(bookContent);
          }
        } else {
          processedContent = bookContent;
        }

        setBook({
          title: bookTitle || "Untitled",
          content: processedContent,
        });
      } catch (error) {
        console.error("Error loading book:", error);
        Alert.alert(
          "Error Loading Book",
          error.message || "Failed to load book content. Please try again.",
          [
            {
              text: "Go Back",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [route.params]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#510851" />
        <Text style={styles.loadingText}>Loading book content...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load book content</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {book.title || "Untitled"}
        </Text>
        <View style={styles.fontControls}>
          <TouchableOpacity
            onPress={decreaseFontSize}
            style={styles.fontButton}
          >
            <Text style={styles.fontButtonText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={increaseFontSize}
            style={styles.fontButton}
          >
            <Text style={styles.fontButtonText}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Text style={[styles.content, { fontSize }]}>
          {book.content || "No content available"}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#510851",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#510851",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#510851",
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
  },
  fontControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  fontButton: {
    padding: 5,
    marginLeft: 10,
  },
  fontButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  content: {
    lineHeight: 24,
    color: "#333",
  },
});

export default ReadBook;
