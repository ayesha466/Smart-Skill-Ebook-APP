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

// --- Add hardcoded books data ---
const hardcodedBooks = {
  "Children's Books": [
    {
      id: "big-fish-and-little-fish",
      title: "Big Fish and Little Fish",
      author: "Unknown",
      coverImage: require("../assets/books/2403-Big-Fish-and-Little-Fish-BB-FKB.webp"),
      file: "https://freekidsbooks.org/wp-content/uploads/2025/03/2403-Big-Fish-and-Little-Fish-BB-FKB.pdf",
      description: "A story about a big fish and a little fish.",
      views: 1000,
    },
    {
      id: "hide-and-seek",
      title: "Hide and Seek",
      author: "Unknown",
      coverImage: require("../assets/books/Hide and seek.webp"),
      file: "https://starofthesea.co.za/wp-content/uploads/2021/02/Hide-and-Seek.pdf",
      description: "A fun hide and seek story.",
      views: 800,
    },
  ],
  "Non-Fiction": [
    {
      id: "brave-new-world",
      title: "Brave New World",
      author: "Aldous Huxley",
      coverImage: require("../assets/books/brave-new-world-aldous-huxley.jpeg"),
      file: "https://www.plato-philosophy.org/wp-content/uploads/2016/05/BraveNewWorld-1.pdf",
      description: "A dystopian social science fiction novel.",
      views: 12345,
    },
    {
      id: "the-time-machine",
      title: "The Time Machine",
      author: "H.G. Wells",
      coverImage: require("../assets/books/the-time-machine-h-g-wells.jpg"),
      file: "https://www.fourmilab.ch/etexts/www/wells/timemach/timemach.pdf",
      description: "A science fiction novel by H. G. Wells, published in 1895.",
      views: 9876,
    },
    {
      id: "book-of-wisdom",
      title: "Book Of Wisdom",
      author: "Unknown",
      //==========================================================================
      coverImage: require("../assets/books/Book Of Wisdom.jpg"),
      file: "https://dn790003.ca.archive.org/0/items/bookofwisdomgree00deanrich/bookofwisdomgree00deanrich.pdf",
      description: "A book of wisdom.",
      views: 5000,
    },
    {
      id: "the-white-darkness",
      title: "The White Darkness",
      author: "Unknown",
      coverImage: require("../assets/books/The White Darkness - PDF Room.jpg"),
      file: "https://cdn.bookey.app/files/pdf/book/en/the-white-darkness.pdf",
      description: "A chilling adventure.",
      views: 3000,
    },
  ],
  "Quran Stories": [
    {
      id: "365-stories",
      title: "365 Stories",
      author: "Unknown",
      coverImage: require("../assets/books/365_stories_.webp"),
      file: "https://www.islamicbulletin.org/free_downloads/sa/365%20Stories%20Part%202.pdf",
      description: "Stories from the Quran.",
      views: 2000,
    },
    {
      id: "angels-belief",
      title: "Angels: Belief in them",
      author: "Sh Al Fawzan",
      coverImage: require("../assets/books/Angels__Belief_in_them__Sh_Al_Fawzan.jpg"),
      file: "https://www.islamicstudiesresources.com/uploads/1/9/8/1/19819855/belief-in-angels.pdf",
      description: "A book about angels in Islam.",
      views: 1500,
    },
  ],
  "Travel & Exploration": [
    {
      id: "age-of-exploration",
      title: "The Age of Exploration",
      author: "Unknown",
      coverImage: require("../assets/books/the age of exploration.jpeg"),
      file: "https://www.coreknowledge.org/wp-content/uploads/2017/03/CKHG_G5_U3_AgeExploration_SR.pdf",
      description: "Exploring the world.",
      views: 1200,
    },
    {
      id: "travel-alone",
      title: "Travel Alone and Love It",
      author: "Unknown",
      coverImage: require("../assets/books/Travel-Alone-and-Love-It1.webp"),
      file: "https://solotravelerworld.com/wp-content/uploads/2009/10/Travel-Alone-and-Love-It1.pdf",
      description: "Traveling solo.",
      views: 900,
    },
  ],
  "Urdu Novel": [
    {
      id: "pir-e-kamil",
      title: "Pir e Kamil",
      author: "Umera Ahmed",
      coverImage: require("../assets/books/Pir e Kamil By Umera Ahmed.jpg"),
      file: "https://bookurdunovel.com/wp-content/uploads/2025/07/peer-e-kamil-novel-by-umera-ahmed-book-urdu-novel-4354.pdf",
      description: "A famous Urdu novel.",
      views: 4000,
    },
    {
      id: "aab-e-hayat",
      title: "Aab e Hayat",
      author: "Umera Ahmed",
      coverImage: require("../assets/books/Umera Ahmed - Aab e Hayat.jpg"),
      file: "https://www.urduchannel.in/wp-content/uploads/2018/11/Aab-e-Hayat-Part-2.pdf",
      description: "Sequel to Pir e Kamil.",
      views: 3500,
    },
  ],
};
// --- End hardcoded books data ---

const Categorybooks = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorybooks();
  }, [category]);

  const fetchCategorybooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API}/books/category/${encodeURIComponent(category)}`
      );
      const data = await response.json();

      // --- If API returns no books, use hardcoded data ---
      let booksToShow = data;
      if (!Array.isArray(data) || data.length === 0) {
        booksToShow = hardcodedBooks[category] || [];
      }
      // If API returns books, but you want to always show both, you can merge:
      // booksToShow = [...(data || []), ...(hardcodedBooks[category] || [])];
      // ---

      const booksWithContent = await Promise.all(
        booksToShow.map(async (book) => {
          // If book has 'file' (hardcoded), return as is
          if (book.file) return book;
          // Otherwise, fetch full book data from API
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
      // --- On error, use hardcoded data ---
      setBooks(hardcodedBooks[category] || []);
      // ---
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

    const bookContent = book.content || book.file; // Use file for hardcoded books

    if (!bookContent) {
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
        content: bookContent,
        author: book.author || "Unknown Author",
        description: book.description || "",
        category: book.category || "Uncategorized",
        pdfUrl: book.pdfFile || book.file || null,
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
            key={book._id || book.id}
            style={styles.bookCard}
            onPress={() => handleBookPress(book)}
          >
            <Image
              source={
                book.coverImage && typeof book.coverImage === "number"
                  ? book.coverImage // local require
                  : { uri: `${API}${book.coverImage}` } // API string
              }
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

export default Categorybooks;
