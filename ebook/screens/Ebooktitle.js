import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList, 
  Platform, 
  StatusBar, 
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API } from '../config';

const { height } = Dimensions.get('window');

const Ebooktitle = ({ navigation }) => {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [language, setLanguage] = useState('English');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const languages = ['English', 'Urdu', 'Spanish', 'French', 'German'];

    const handleWriteForMe = async () => {
        if (!topic.trim()) {
            Alert.alert('Error', 'Please enter a topic');
            return;
        }

        setLoading(true);
        try {
            console.log('Generating content for:', { topic, keywords, language });
            
            const response = await fetch(`${API}/api/generate-book-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: topic,
                    genre: keywords,
                    language: language
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate content');
            }

            const data = await response.json();
            console.log('Generated content:', data);

            if (!data || !data.content) {
                throw new Error('Invalid response from server');
            }

            // Navigate to ReadBook with the generated content
            navigation.navigate('ReadBook', {
                book: {
                    title: data.title || topic,
                    content: data.content,
                    author: 'AI Generated',
                    isGenerated: true
                }
            });
        } catch (error) {
            console.error('Error generating content:', error);
            Alert.alert('Error', error.message || 'Failed to generate content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderLanguageItem = ({ item }) => (
        <TouchableOpacity
            style={styles.languageItem}
            onPress={() => {
                setLanguage(item);
                setModalVisible(false);
            }}
        >
            <Text style={styles.languageText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ebook Title</Text>
            </View>

            <ScrollView style={styles.content}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your topic or book idea"
                    value={topic}
                    onChangeText={setTopic}
                    multiline
                    numberOfLines={3}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Add keywords separated by comma (optional)"
                    value={keywords}
                    onChangeText={setKeywords}
                />

                <View style={styles.languageContainer}>
                    <Text style={styles.languageLabel}>Select Language</Text>
                    <TouchableOpacity style={styles.languageSelect} onPress={() => setModalVisible(true)}>
                        <Text style={styles.selectedLanguage}>{language}</Text>
                        <Icon name="chevron-down" size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {generatedContent && (
                    <View style={styles.previewContainer}>
                        <Text style={styles.previewTitle}>Preview</Text>
                        <Text style={styles.previewContent} numberOfLines={3}>
                            {generatedContent.content}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={languages}
                            renderItem={renderLanguageItem}
                            keyExtractor={(item) => item}
                        />
                    </View>
                </View>
            </Modal>

            <TouchableOpacity 
                style={[styles.writeButton, loading && styles.buttonDisabled]} 
                onPress={handleWriteForMe}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.writeButtonText}>GENERATE CONTENT</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C8A2C8',
    },
    header: {
        backgroundColor: "#510851",
        paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
        paddingBottom: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 44 + 30 : StatusBar.currentHeight + 30,
        marginTop: 60,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%',
        textAlign: 'left',
        fontSize: 16,
    },
    languageContainer: {
        marginBottom: 20,
        width: '100%',
    },
    languageLabel: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'left',
        color: '#333',
    },
    languageSelect: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedLanguage: {
        fontSize: 16,
        color: '#333',
    },
    writeButton: {
        backgroundColor: '#510851',
        padding: 18,
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 30,
    },
    writeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
        maxHeight: '80%',
    },
    languageItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    languageText: {
        fontSize: 16,
        color: '#333',
    },
    previewContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    previewContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});

export default Ebooktitle;