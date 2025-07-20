import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

const ReadBook = () => {
  const [loading, setLoading] = useState(true);
  const [pdfUri, setPdfUri] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const loadBook = () => {
      try {
        const { book: bookData, title, content } = route.params;
        if (!bookData && !content) {
          throw new Error("No book data provided");
        }
        const bookContent = bookData?.content || content;
        const bookTitle = bookData?.title || title || "Untitled";
        setBookTitle(bookTitle);
        let uri = "";
        if (typeof bookContent === "number") {
          // Local asset, get its URI
          const asset = Image.resolveAssetSource(bookContent);
          uri = asset.uri;
        } else if (typeof bookContent === "string") {
          uri = bookContent;
        }
        setPdfUri(uri);
      } catch (error) {
        console.error("Error loading book:", error);
        setPdfUri("");
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [route.params]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#510851" />
        <Text style={styles.loadingText}>Loading book content...</Text>
      </View>
    );
  }

  if (!pdfUri) {
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
          {bookTitle}
        </Text>
      </View>
      <WebView
        source={{
          uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            pdfUri
          )}`,
        }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#510851" />
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
      />
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
  webview: {
    width: width,
    height: height,
    flex: 1,
  },
});

export default ReadBook;
