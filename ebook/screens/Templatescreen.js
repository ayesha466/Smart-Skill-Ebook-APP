import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const normalize = (size) => size * (width / 375);

const GEMINI_API_KEY = ""; 

const TemplateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { templateTitle } = route.params || { templateTitle: 'Custom Ebook' }; 

  const [sections, setSections] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentAiSectionId, setCurrentAiSectionId] = useState(null);

  useEffect(() => {
    const initialSections = getTemplateSections(templateTitle);
    setSections(initialSections);
  }, [templateTitle]);

  const getTemplateSections = (title) => {
    switch (title) {
      case 'Ebook on Personal Development':
        return [
          { id: 'sec1', title: 'Introduction to Personal Growth', content: '', aiPromptHint: 'Write an intro to personal growth' },
          { id: 'sec2', title: 'Setting Goals & Habits', content: '', aiPromptHint: 'Explain goal setting and habit formation' },
          { id: 'sec3', title: 'Mindfulness & Well-being', content: '', aiPromptHint: 'Describe mindfulness techniques' },
          { id: 'sec4', title: 'Overcoming Challenges', content: '', aiPromptHint: 'Strategies for overcoming life challenges' },
        ];
      case 'Ebook on Health & Wellness':
        return [
          { id: 'sec1', title: 'Understanding Health & Wellness', content: '', aiPromptHint: 'Define health and wellness' },
          { id: 'sec2', title: 'Nutrition Fundamentals', content: '', aiPromptHint: 'Basics of healthy nutrition' },
          { id: 'sec3', title: 'Importance of Physical Activity', content: '', aiPromptHint: 'Benefits of daily exercise' },
          { id: 'sec4', title: 'Mental Health & Stress Management', content: '', aiPromptHint: 'Tips for managing stress and improving mental health' },
        ];
      case 'Healthy & Special diet':
        return [
          { id: 'sec1', title: 'Introduction to Healthy Diets', content: '', aiPromptHint: 'Overview of balanced diets' },
          { id: 'sec2', title: 'Meal Planning & Preparation', content: '', aiPromptHint: 'Guide to effective meal planning' },
          { id: 'sec3', title: 'Understanding Macronutrients', content: '', aiPromptHint: 'Explain carbs, proteins, and fats' },
        ];
      case 'Education & Academics':
        return [
          { id: 'sec1', title: 'Effective Study Techniques', content: '', aiPromptHint: 'Best study methods for students' },
          { id: 'sec2', title: 'Time Management for Students', content: '', aiPromptHint: 'Time management tips for academic success' },
          { id: 'sec3', title: 'Research & Essay Writing', content: '', aiPromptHint: 'How to write a good research essay' },
        ];
      case 'Cultural & Heritage ebook':
        return [
          { id: 'sec1', title: 'Introduction to Culture & Heritage', content: '', aiPromptHint: 'What is culture and heritage?' },
          { id: 'sec2', title: 'Exploring Traditions & Customs', content: '', aiPromptHint: 'Describe unique cultural traditions' },
          { id: 'sec3', title: 'Preserving Cultural Identity', content: '', aiPromptHint: 'Importance of preserving cultural identity' },
        ];
      default:
        return [
          { id: 'sec1', title: 'Chapter 1: Introduction', content: '', aiPromptHint: 'Write an introduction for my ebook' },
          { id: 'sec2', title: 'Chapter 2: Main Content', content: '', aiPromptHint: 'Expand on the main topic' },
        ];
    }
  };

  const handleGenerateAIContent = async (sectionId, promptTopic) => {
    if (!promptTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic or keywords for AI generation.');
      return;
    }

    setAiLoading(true);
    setCurrentAiSectionId(sectionId);

    try {
      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: `Generate a detailed and engaging paragraph or short section about "${promptTopic}" for an ebook chapter. Focus on providing informative and easy-to-understand content. Limit the response to approximately 200 words.` }] });

      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setSections(prevSections =>
          prevSections.map(sec =>
            sec.id === sectionId ? { ...sec, content: sec.content + '\n\n' + text } : sec
          )
        );
      } else {
        Alert.alert('Error', 'AI could not generate content. Please try a different topic.');
        console.error('AI response structure unexpected:', result);
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      Alert.alert('Error', 'Failed to generate content with AI. Please check your network or try again later.');
    } finally {
      setAiLoading(false);
      setCurrentAiSectionId(null);
    }
  };

  const handleSectionContentChange = (id, text) => {
    setSections(prevSections =>
      prevSections.map(sec => (sec.id === id ? { ...sec, content: text } : sec))
    );
  };

  const handleAddSection = () => {
    const newId = `sec${sections.length + 1}`;
    setSections(prevSections => [
      ...prevSections,
      { id: newId, title: `New Chapter ${sections.length + 1}`, content: '', aiPromptHint: 'Write about this new chapter' }
    ]);
    Alert.alert('Success', 'New Chapter added!');
  };

  const handleDeleteSection = (id) => {
    Alert.alert(
      "Delete Chapter",
      "Are you sure you want to delete this chapter?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => setSections(prevSections => prevSections.filter(sec => sec.id !== id)) }
      ]
    );
  };

  const handleSaveDraft = () => {
    const fullEbookContent = sections.map(sec => `## ${sec.title}\n\n${sec.content}`).join('\n\n');
    console.log("Saving Draft:", fullEbookContent);
    Alert.alert('Success', 'Ebook draft saved!');
  };

  const handleExportEbook = () => {
    const fullEbookContent = sections.map(sec => `## ${sec.title}\n\n${sec.content}`).join('\n\n');
    console.log("Exporting Ebook:", fullEbookContent);
    Alert.alert('Success', 'Ebook exported!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? normalize(60) : normalize(20)}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={normalize(24)} color="#333" />
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
                onChangeText={(text) => setSections(prevSections =>
                  prevSections.map(s => (s.id === sec.id ? { ...s, title: text } : s))
                )}
                placeholder={`Chapter ${index + 1} Title`}
                placeholderTextColor="#666"
              />
              <TouchableOpacity onPress={() => handleDeleteSection(sec.id)} style={styles.deleteButton}>
                <Icon name="trash" size={normalize(18)} color="#3f3d3dff" />
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
              {(aiLoading && currentAiSectionId === sec.id) ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="magic" size={normalize(16)} color="#fff" />
                  <Text style={styles.aiGenerateSectionButtonText}>Generate AI Content</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addSectionButton} onPress={handleAddSection}>
          <Icon name="plus-circle" size={normalize(20)} color="#fff" />
          <Text style={styles.addSectionButtonText}>Add New Chapter</Text>
        </TouchableOpacity>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDraft}>
            <Icon name="save" size={normalize(18)} color="#fff" />
            <Text style={styles.saveButtonText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportEbook}>
            <Icon name="file-export" size={normalize(18)} color="#fff" />
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
    backgroundColor: '#F7F2F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(15),
    paddingTop: Platform.OS === 'ios' ? normalize(50) : normalize(20),
    paddingBottom: normalize(15),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#333',
  },
  scrollViewContent: {
    padding: normalize(15),
    paddingBottom: normalize(100),
  },
  chapterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(15),
    padding: normalize(15),
    marginBottom: normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: normalize(5),
    borderLeftColor: '#800080',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  chapterTitleInput: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    paddingVertical: normalize(5),
    borderBottomWidth: 1,
    borderBottomColor: '#E6E0EB',
    marginBottom: normalize(10),
  },
  deleteButton: {
    padding: normalize(5),
    marginLeft: normalize(10),
  },
  chapterContentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: normalize(8),
    padding: normalize(10),
    fontSize: normalize(15),
    minHeight: normalize(120),
    textAlignVertical: 'top',
    color: '#333',
    backgroundColor: '#FDFBFE',
    marginBottom: normalize(15),
  },
  aiGenerateSectionButton: {
    backgroundColor: '#624F62',
    paddingVertical: normalize(12),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  aiGenerateSectionButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginLeft: normalize(10),
  },
  addSectionButton: {
    backgroundColor: '#776277ff',
    paddingVertical: normalize(15),
    borderRadius: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: normalize(10),
    marginBottom: normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  addSectionButtonText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginLeft: normalize(10),
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },
  saveButton: {
    backgroundColor: '#9b519bff',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(10),
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  exportButton: {
    backgroundColor: '#624F62',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(10),
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginLeft: normalize(10),
  },
});

export default TemplateScreen;
