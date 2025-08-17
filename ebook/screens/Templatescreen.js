import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API } from "../config";

// Assuming you have an API constant like the one from your previous code
// const API = "http://localhost:3000"; // Update this with your actual backend URL

const { width } = Dimensions.get("window");
// A helper function to normalize sizes based on screen width
const normalize = (size) => size * (width / 375);

const TemplateScreen = () => {
  // Hooks to access navigation and route parameters
  const navigation = useNavigation();
  const route = useRoute();

  // Get the template title from route parameters, defaulting to 'Custom Ebook'
  const { templateTitle } = route.params || { templateTitle: "Custom Ebook" };

  // State to hold the ebook sections, loading status for AI generation, and the current section being generated
  const [sections, setSections] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentAiSectionId, setCurrentAiSectionId] = useState(null);

  // Effect hook to set the initial sections when the component mounts or the templateTitle changes
  useEffect(() => {
    const initialSections = getTemplateSections(templateTitle);
    setSections(initialSections);
  }, [templateTitle]);

  // Function to define the structure of different ebook templates
  const getTemplateSections = (title) => {
    switch (title) {
      case "Ebook on Personal Development":
        return [
          {
            id: "sec1",
            title: "Introduction to Personal Growth",
            content: "",
            aiPromptHint: "Write an intro to personal growth",
          },
          {
            id: "sec2",
            title: "Setting Goals & Habits",
            content: "",
            aiPromptHint: "Explain goal setting and habit formation",
          },
          {
            id: "sec3",
            title: "Mindfulness & Well-being",
            content: "",
            aiPromptHint: "Describe mindfulness techniques",
          },
          {
            id: "sec4",
            title: "Overcoming Challenges",
            content: "",
            aiPromptHint: "Strategies for overcoming life challenges",
          },
        ];
      case "Ebook on Health & Wellness":
        return [
          {
            id: "sec1",
            title: "Understanding Health & Wellness",
            content: "",
            aiPromptHint: "Define health and wellness",
          },
          {
            id: "sec2",
            title: "Nutrition Fundamentals",
            content: "",
            aiPromptHint: "Basics of healthy nutrition",
          },
          {
            id: "sec3",
            title: "Importance of Physical Activity",
            content: "",
            aiPromptHint: "Benefits of daily exercise",
          },
          {
            id: "sec4",
            title: "Mental Health & Stress Management",
            content: "",
            aiPromptHint:
              "Tips for managing stress and improving mental health",
          },
        ];
      case "Healthy & Special diet":
        return [
          {
            id: "sec1",
            title: "Introduction to Healthy Diets",
            content: "",
            aiPromptHint: "Overview of balanced diets",
          },
          {
            id: "sec2",
            title: "Meal Planning & Preparation",
            content: "",
            aiPromptHint: "Guide to effective meal planning",
          },
          {
            id: "sec3",
            title: "Understanding Macronutrients",
            content: "",
            aiPromptHint: "Explain carbs, proteins, and fats",
          },
        ];
      case "Education & Academics":
        return [
          {
            id: "sec1",
            title: "Effective Study Techniques",
            content: "",
            aiPromptHint: "Best study methods for students",
          },
          {
            id: "sec2",
            title: "Time Management for Students",
            content: "",
            aiPromptHint: "Time management tips for academic success",
          },
          {
            id: "sec3",
            title: "Research & Essay Writing",
            content: "",
            aiPromptHint: "How to write a good research essay",
          },
        ];
      case "Cultural & Heritage ebook":
        return [
          {
            id: "sec1",
            title: "Introduction to Culture & Heritage",
            content: "",
            aiPromptHint: "What is culture and heritage?",
          },
          {
            id: "sec2",
            title: "Exploring Traditions & Customs",
            content: "",
            aiPromptHint: "Describe unique cultural traditions",
          },
          {
            id: "sec3",
            title: "Preserving Cultural Identity",
            content: "",
            aiPromptHint: "Importance of preserving cultural identity",
          },
        ];
      default:
        return [
          {
            id: "sec1",
            title: "Chapter 1: Introduction",
            content: "",
            aiPromptHint: "Write an introduction for my ebook",
          },
          {
            id: "sec2",
            title: "Chapter 2: Main Content",
            content: "",
            aiPromptHint: "Expand on the main topic",
          },
        ];
    }
  };

  // Function to handle the AI content generation request to the backend
  const handleGenerateAIContent = async (sectionId, promptTopic) => {
    // Validation to ensure a topic is provided
    if (!promptTopic.trim()) {
      Alert.alert(
        "Error",
        "Please enter a topic or keywords for AI generation."
      );
      return;
    }

    // Set loading state for the specific section
    setAiLoading(true);
    setCurrentAiSectionId(sectionId);

    try {
      // Make a POST request to the backend API endpoint
      const response = await fetch(`${API}/api/generate-ai-section`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptTopic,
        }),
      });

      // Handle non-OK responses from the server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate AI content");
      }

      const data = await response.json();

      // Check if the response contains the generated content
      if (data.success && data.generatedContent) {
        // Update the state with the new content appended to the existing content
        setSections((prevSections) =>
          prevSections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  content: sec.content + "\n\n" + data.generatedContent,
                }
              : sec
          )
        );
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      // Display an error alert if the API call fails
      console.error("Error generating AI content:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to generate content with AI. Please try again."
      );
    } finally {
      // Reset loading state
      setAiLoading(false);
      setCurrentAiSectionId(null);
    }
  };

  // Handler for updating the content of a specific section
  const handleSectionContentChange = (id, text) => {
    setSections((prevSections) =>
      prevSections.map((sec) =>
        sec.id === id ? { ...sec, content: text } : sec
      )
    );
  };

  // Handler for adding a new section to the ebook
  const handleAddSection = () => {
    const newId = `sec${sections.length + 1}`;
    setSections((prevSections) => [
      ...prevSections,
      {
        id: newId,
        title: `New Chapter ${sections.length + 1}`,
        content: "",
        aiPromptHint: "Write about this new chapter",
      },
    ]);
    Alert.alert("Success", "New Chapter added!");
  };

  // Handler for deleting a section with a confirmation alert
  const handleDeleteSection = (id) => {
    Alert.alert(
      "Delete Chapter",
      "Are you sure you want to delete this chapter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () =>
            setSections((prevSections) =>
              prevSections.filter((sec) => sec.id !== id)
            ),
        },
      ]
    );
  };

  // Handler for saving the current draft (currently just logs and shows an alert)
  const handleSaveDraft = () => {
    const fullEbookContent = sections
      .map((sec) => `## ${sec.title}\n\n${sec.content}`)
      .join("\n\n");
    console.log("Saving Draft:", fullEbookContent);
    Alert.alert("Success", "Ebook draft saved!");
  };

  // Handler for exporting the ebook (currently just logs and shows an alert)
  const handleExportEbook = () => {
    const fullEbookContent = sections
      .map((sec) => `## ${sec.title}\n\n${sec.content}`)
      .join("\n\n");
    console.log("Exporting Ebook:", fullEbookContent);
    Alert.alert("Success", "Ebook exported!");
  };

  // The main component render function
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios" ? normalize(60) : normalize(20)
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={normalize(24)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{templateTitle}</Text>
        <View style={{ width: normalize(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {sections.map((sec, index) => (
          <View key={sec.id} style={styles.chapterCard}>
            <View style={styles.chapterHeader}>
              <TextInput
                style={styles.chapterTitleInput}
                value={sec.title}
                onChangeText={(text) =>
                  setSections((prevSections) =>
                    prevSections.map((s) =>
                      s.id === sec.id ? { ...s, title: text } : s
                    )
                  )
                }
                placeholder={`Chapter ${index + 1} Title`}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                onPress={() => handleDeleteSection(sec.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={normalize(18)} color="#3f3d3dff" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.chapterContentInput}
              placeholder={`Write content for this chapter or generate with AI... \nAI Prompt Hint: ${sec.aiPromptHint}`}
              value={sec.content}
              onChangeText={(text) => handleSectionContentChange(sec.id, text)}
              multiline
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.aiGenerateSectionButton}
              onPress={() => handleGenerateAIContent(sec.id, sec.title)}
              disabled={aiLoading && currentAiSectionId === sec.id}
            >
              {aiLoading && currentAiSectionId === sec.id ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={normalize(16)} color="#fff" />
                  <Text style={styles.aiGenerateSectionButtonText}>
                    Generate AI Content
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addSectionButton}
          onPress={handleAddSection}
        >
          <Ionicons name="add-circle" size={normalize(20)} color="#fff" />
          <Text style={styles.addSectionButtonText}>Add New Chapter</Text>
        </TouchableOpacity>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDraft}>
            <Ionicons name="save" size={normalize(18)} color="#fff" />
            <Text style={styles.saveButtonText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportEbook}
          >
            <Ionicons name="share-outline" size={normalize(18)} color="#fff" />
            <Text style={styles.exportButtonText}>Export Ebook</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F2F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: normalize(15),
    paddingTop: Platform.OS === "ios" ? normalize(50) : normalize(20),
    paddingBottom: normalize(15),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: normalize(5),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContent: {
    padding: normalize(15),
    paddingBottom: normalize(100),
  },
  chapterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: normalize(15),
    padding: normalize(15),
    marginBottom: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: normalize(5),
    borderLeftColor: "#800080",
  },
  chapterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: normalize(10),
  },
  chapterTitleInput: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    paddingVertical: normalize(5),
    borderBottomWidth: 1,
    borderBottomColor: "#E6E0EB",
    marginBottom: normalize(10),
  },
  deleteButton: {
    padding: normalize(5),
    marginLeft: normalize(10),
  },
  chapterContentInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: normalize(8),
    padding: normalize(10),
    fontSize: normalize(15),
    minHeight: normalize(120),
    textAlignVertical: "top",
    color: "#333",
    backgroundColor: "#FDFBFE",
    marginBottom: normalize(15),
  },
  aiGenerateSectionButton: {
    backgroundColor: "#624F62",
    paddingVertical: normalize(12),
    borderRadius: normalize(10),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  aiGenerateSectionButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
    marginLeft: normalize(10),
  },
  addSectionButton: {
    backgroundColor: "#776277ff",
    paddingVertical: normalize(15),
    borderRadius: normalize(15),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: normalize(10),
    marginBottom: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  addSectionButtonText: {
    color: "#fff",
    fontSize: normalize(18),
    fontWeight: "bold",
    marginLeft: normalize(10),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },
  saveButton: {
    backgroundColor: "#9b519bff",
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(10),
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
    marginLeft: normalize(10),
  },
  exportButton: {
    backgroundColor: "#624F62",
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(10),
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
    marginLeft: normalize(10),
  },
});

export default TemplateScreen;
