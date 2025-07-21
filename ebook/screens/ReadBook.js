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
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

const ReadBook = () => {
  const [loading, setLoading] = useState(true);
  const [bookTitle, setBookTitle] = useState("");
  const [bookContent, setBookContent] = useState("");
  const [pdfUri, setPdfUri] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const loadBook = () => {
      try {
        const { book: bookData, title, content } = route.params;
        const bookTitle = bookData?.title || title || "Untitled";
        setBookTitle(bookTitle);

        const contentValue =
          bookData?.content || content || bookData?.file || "";
        if (
          typeof contentValue === "string" &&
          contentValue.trim().toLowerCase().endsWith(".pdf")
        ) {
          setPdfUri(contentValue);
        } else if (typeof contentValue === "string") {
          setBookContent(contentValue);
        } else if (typeof contentValue === "object") {
          setBookContent(JSON.stringify(contentValue, null, 2));
        }
      } catch (error) {
        setBookContent("Failed to load book content.");
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
      {pdfUri ? (
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
      ) : (
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.content}>{bookContent}</Text>
        </ScrollView>
      )}
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
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  content: {
    lineHeight: 24,
    color: "#333",
    fontSize: 16,
  },
});

export default ReadBook;
