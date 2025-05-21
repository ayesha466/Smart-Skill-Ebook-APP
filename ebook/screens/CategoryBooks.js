import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../config";

const CategoryBooks = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryBooks();
  }, [category]);

  const fetchCategoryBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API}/books/category/${encodeURIComponent(category)}`
      );
      const data = await response.json();

      // Fetch complete book data for each book
      const booksWithContent = await Promise.all(
        data.map(async (book) => {
          try {
            const bookResponse = await fetch(`${API}/books/${book._id}`);
            const completeBookData = await bookResponse.json();
            return completeBookData;
          } catch (error) {
            console.error(`Error fetching book ${book._id}:`, error);
            return book;
          }
        })
      );

      setBooks(booksWithContent);
    } catch (error) {
      console.error("Error fetching category books:", error);
      Alert.alert("Error", "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book) => {
    if (!book) {
      Alert.alert("Error", "Book data is not available");
      return;
    }

    // Ensure we have the required content before navigating
    if (!book.content) {
      Alert.alert(
        "Error",
        "This book's content is not available. Please try another book.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate("ReadBook", {
      book: {
        title: book.title || "Untitled",
        content: book.content,
        author: book.author || "Unknown Author",
        description: book.description || "",
        category: book.category || "Uncategorized",
        pdfUrl: book.pdfFile || null,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#510851" />
        <Text style={styles.loadingText}>Loading books...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{category}</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {books.map((book) => (
          <TouchableOpacity
            key={book._id}
            style={styles.bookCard}
            onPress={() => handleBookPress(book)}
          >
            <Image
              source={{ uri: `${API}${book.coverImage}` }}
              style={styles.bookCover}
              resizeMode="cover"
            />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <Text style={styles.bookDescription} numberOfLines={2}>
                {book.description}
              </Text>
              <Text style={styles.viewsText}>👁️ {book.views} views</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#510851",
  },
  headerContainer: {
    backgroundColor: "#510851",
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "Regular",
    color: "#FFF",
    textAlign: "left",
  },
  contentContainer: {
    padding: 16,
  },
  bookCard: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookCover: {
    width: 100,
    height: 150,
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  bookDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  viewsText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});

export default CategoryBooks;
