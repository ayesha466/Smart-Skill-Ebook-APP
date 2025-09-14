# Ebook AI APP
# 📚 Smart AI Ebook App

A comprehensive React Native application that combines traditional ebook reading with AI-powered content generation, allowing users to create, read, and discover books in an intelligent way.

---

## 🚀 Overview

Smart AI Ebook App is a full-stack mobile application that revolutionizes the way users interact with digital books. Built with React Native and powered by Google's Gemini AI, it offers a seamless experience for both readers and writers, featuring AI-generated content, customizable templates, and an intuitive user interface.

---

## ✨ Key Features

### 🔐 Authentication & User Management
* **Secure User Registration & Login** - `bcrypt` password hashing
* **Password Recovery System** - Email-based OTP verification
* **User Profile Management** - Personalized settings and preferences

### 📖 Reading Experience
* **Multi-format Book Support** - PDF, text, and AI-generated content
* **Category-based Organization** - Fiction, Non-Fiction, Travel, Children's Books, Quran Stories, Urdu Novels
* **Trending Books Discovery** - Popular content recommendations
* **PDF Viewer Integration** - Native PDF rendering with `WebView`

### ✍️ Writing & Creation
* **AI-Powered Book Generation** - Create books with customizable parameters
* **Smart Templates** - Pre-built structures for different genres
* **Manual Writing Interface** - Traditional text editor with chapter management
* **Content Enhancement** - AI-assisted section generation

### 🤖 AI Integration
* **Google Gemini AI** - Advanced content generation
* **Smart Story Creation** - Generate narratives from titles
* **Content Expansion** - AI-powered chapter development
* **language Support** - English

### 🎨 User Interface
* **Responsive Design** - Optimized for all screen sizes
* **Modern UI/UX** - Material Design principles
* **Dark/Light Themes** - Customizable appearance
* **Intuitive Navigation** - Sidebar and bottom navigation

---

## 🧑‍💻 Tech Stack

### Frontend
* **React Native** - Cross-platform mobile development
* **Expo** - Development platform and tools
* **React Navigation** - Screen navigation management
* **AsyncStorage** - Local data persistence
* **React Native Vector Icons** - Icon library
* **React Native PDF** - PDF document handling
* **WebView** - Web content rendering

### Backend
* **Node.js** - JavaScript runtime environment
* **Express.js** - Web application framework
* **MongoDB** - NoSQL database
* **Mongoose** - MongoDB object modeling
* **Google Gemini AI** - AI content generation
* **Nodemailer** - Email service integration
* **Multer** - File upload handling
* **PDFKit** - PDF generation
* **bcrypt** - Password hashing

### Development Tools
* **Nodemon** - Development server with auto-restart
* **Git** - Version control
* **VS Code** - Code editor

---

---

⚙️ Setup Instructions

 🧑‍💻 Clone the Repository
```bash
# Clone the main project
git clone <repository-url>
cd ebook-app
# Clone the backend server
cd server
git clone <server-repository-url>

📦 Install Dependencies
Frontend (React Native)
cd ebook
npm install
# or
yarn install

Backend (Node.js)
cd server
npm install
# or
yarn install

🔐 Configure Environment Variables
Backend Environment (.env)
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/ebook

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=3001

Frontend Configuration (config.js)
// Update the API endpoint in ebook/config.js
export const API = "http://your-ip-address:3001";

▶️ Run the Project
###Start Backend Server
cd server
npm start
# Server will run on http://localhost:3001

###Start Frontend App
cd ebook
npm run start
# or
expo start

###Run on Device/Emulator
# For Android
npm run android

# For iOS
npm run ios

# For Web
npm run web

📦 Deployment
###Backend Deployment
Environment Setup - Configure production environment variables

Database Setup - Set up production MongoDB instance

Server Deployment - Deploy to cloud platform (Heroku, AWS, etc.)

Domain Configuration - Set up custom domain and SSL

###Frontend Deployment
Build Generation - Create production build

App Store Submission - Submit to Google Play Store and Apple App Store

OTA Updates - Configure Expo updates for seamless app updates

👥 Team Contributions
👥 Developed By
Ateeq ur Rehman.

Role: Full-Stack Developer.

Work: Backend APIs, Auth system, Database integration.

Ayesha Shabbir.

Role: Frontend Developer.

Work: UI Design, ReactNative Components.

🧠 Challenges Solved
Technical Challenges
Cross-platform Compatibility - Unified codebase for iOS and Android

AI Integration - Seamless integration with Google Gemini API

File Management - Efficient handling of PDFs and images

Real-time Updates - Dynamic content generation and updates

State Management - Complex state handling across multiple screens

User Experience Challenges
Intuitive Navigation - Easy-to-use interface for all user types

Content Discovery - Smart categorization and recommendation system

Offline Functionality - Local storage for user preferences

Performance Optimization - Smooth animations and fast loading

Security Challenges
User Authentication - Secure login and registration system

Password Security - bcrypt hashing and OTP verification

API Security - Protected endpoints and data validation

File Upload Security - Safe file handling and validation

🙏 Acknowledgements
Google Gemini AI - For providing the AI content generation capabilities

React Native Community - For the excellent documentation and support

Expo Team - For the amazing development platform

MongoDB - For the robust database solution

Open Source Contributors - For the libraries and tools that made this possible


* **Standee Design (PDF):** [https://github.com/ayesha466/Smart-Skill-Ebook-APP/blob/6bb62bc51b9731d81a2584358ca4f2ff6c2562ef/ebook%20flex%20pdf.pdf]

* **Figma Design (PDF):** [https://github.com/ayesha466/Smart-Skill-Ebook-APP/blob/91f89e0ce2c1863d8d249aa6d5b32c062d9a85fa/Smart%20Building%20E-book%20APP.zip]

* **Documentation:** [https://github.com/ayesha466/Smart-Skill-Ebook-APP/blob/a2368d78f7a8af65b21da5921476ad7b8a4cfba9/FYP%20Document%20report%20final%20.pdf]
