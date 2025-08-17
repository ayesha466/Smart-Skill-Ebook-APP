const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const app = express();
const port = 3001;

dotenv.config();

app.use(cors());
app.use(express.json());

//============================================Create uploads directory if it doesn't exist============================================
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

//============================================Configure multer for file uploads============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// mongoose.connect(process.env.MONGODB_URI)
// .then(() => {
//   console.log('MongoDB connected successfully');
// })
// .catch((err) => {
//   console.error('MongoDB connection error:', err);
// });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const User = require("./models/User");
const Book = require("./models/Book");

//============================================Create a transporter for sending emails============================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587, // Using port 587 instead of 465
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // For development only, remove in production
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

//============================================Store OTPs temporarily (in production, use Redis or similar)============================================
const otpStore = new Map();

//============================================Generate a random 6-digit OTP============================================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//============================================Forget Password API============================================
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with timestamp (valid for 5 minutes)
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      expiresIn: 5 * 60 * 1000, // 5 minutes
    });

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #510851;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #510851; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Smart AI Ebook Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", email);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({
      error: "Failed to send OTP",
      details: error.message,
    });
  }
});

//============================================Verify OTP API============================================
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    // Check if OTP is expired
    if (Date.now() - storedData.timestamp > storedData.expiresIn) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid, generate a token for password reset
    const resetToken = generateOTP();
    otpStore.set(email, {
      ...storedData,
      resetToken,
      isVerified: true,
    });

    res.json({ message: "OTP verified successfully", resetToken });
  } catch (error) {
    console.error("Error in verify OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

//============================================Reset Password API============================================
app.post("/reset-password", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    console.log("Reset password request received:", { email, resetToken });

    // Validate input
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if reset token is valid
    const storedData = otpStore.get(email);
    if (
      !storedData ||
      !storedData.isVerified ||
      storedData.resetToken !== resetToken
    ) {
      console.log("Invalid reset token for email:", email);
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Clear the OTP data
    otpStore.delete(email);

    console.log("Password reset successful for:", email);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({
      error: "Failed to reset password",
      details: error.message,
    });
  }
});

//============================================signup============================================
// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { fullName, username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      username,
      password: hashedPassword,
      email,
    });

    await user.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

//============================================login============================================
//============================================login============================================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

//============================================Get all categories============================================
app.get("/categories", (req, res) => {
  const categories = [
    { id: 1, title: "Non-Fiction", image: "/images/nonfiction.png" },
    { id: 2, title: "Travel & Exploration", image: "/images/travel.png" },
    { id: 3, title: "Urdu Novel", image: "/images/urdu.png" },
    { id: 4, title: "Children's Books", image: "/images/children.png" },
    { id: 5, title: "Quran Stories", image: "/images/quran.png" },
    { id: 6, title: "Fiction", image: "/images/fiction.png" },
  ];
  res.json(categories);
});

//============================================Get trending books============================================
app.get("/trending-books", async (req, res) => {
  try {
    const trendingBooks = await Book.find().sort({ views: -1 }).limit(10);
    res.json(trendingBooks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trending books" });
  }
});

//============================================Get books by category============================================
app.get("/books/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const books = await Book.find({ category })
      .sort({ views: -1 })
      .select("title author description coverImage views");

    res.json(books);
  } catch (error) {
    console.error("Error fetching category books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

//============================================Upload a new book============================================
app.post(
  "/books",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, author, description, category } = req.body;

      const book = new Book({
        title,
        author,
        description,
        category,
        coverImage: req.files["coverImage"][0].path,
        bookFile: req.files["bookFile"][0].path,
      });

      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload book" });
    }
  }
);

//============================================Get a single book============================================
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Increment view count
    book.views += 1;
    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

//============================================Serve uploaded files============================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//============================================AI Story Generation============================================
app.post("/api/generate-story", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    console.log("Generating story for title:", title);

    const prompt = `Write a creative and engaging story based on the title: "${title}". 
        The story should be suitable for reading in an ebook app. 
        Include interesting characters, a clear plot, and a satisfying conclusion. 
        Format the story with proper paragraphs and line breaks.
        Make sure the story is at least 500 words long.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini API Response:", JSON.stringify(response.data, null, 2));

    if (
      !response.data ||
      !response.data.candidates ||
      !response.data.candidates[0].content.parts[0].text
    ) {
      throw new Error("Invalid response from Gemini API");
    }

    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log("Successfully generated story");

    // Format the response
    const story = {
      title: title,
      content: generatedText,
      generatedAt: new Date(),
    };

    res.json(story);
  } catch (error) {
    console.error("Detailed error in story generation:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      response: error.response?.data,
    });

    // Send more detailed error information
    res.status(500).json({
      error: "Failed to generate story",
      details: error.response?.data?.error?.message || error.message,
      type: error.name,
    });
  }
});

//============================================Book Content Generation============================================
app.post("/api/generate-book-content", async (req, res) => {
  try {
    const { title, genre } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    console.log("Generating book content for:", { title, genre });

    const prompt = `Write a creative and engaging ${
      genre || "story"
    } based on the title: "${title}". 
        The story should have propoer headings upto 5 to 10 headings that can be in story's chapters.
        Use markdown formatting for sections.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini API Response:", JSON.stringify(response.data, null, 2));

    if (
      !response.data ||
      !response.data.candidates ||
      !response.data.candidates[0].content.parts[0].text
    ) {
      throw new Error("Invalid response from Gemini API");
    }

    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log("Generated Content:", generatedText);

    // Format the response
    const bookContent = {
      title: title,
      genre: genre,
      content: generatedText,
      generatedAt: new Date(),
    };

    res.json(bookContent);
  } catch (error) {
    console.error("Detailed error in book content generation:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      response: error.response?.data,
    });

    res.status(500).json({
      error: "Failed to generate book content",
      details: error.response?.data?.error?.message || error.message,
      type: error.name,
    });
  }
});

//============================================AI Book Generation============================================
app.post("/api/generate-ai-book", async (req, res) => {
  try {
    const {
      title,
      length,
      topic,
      keypoints,
      tone = "Formal",
      language = "English",
    } = req.body;
    if (!title || !length || !topic) {
      return res
        .status(400)
        .json({ error: "Title, length, and topic are required" });
    }
    console.log("Generating AI book with:", {
      title,
      length,
      topic,
      keypoints,
    });
    // Determine word count based on length
    const wordCounts = {
      Short: 800,
      Medium: 1200,
      Long: 2000,
    };
    const prompt = `Write a ${length.toLowerCase()} book (approximately ${
      wordCounts[length]
    } words) about "${topic}".
        ${keypoints ? `Include these key points: ${keypoints}` : ""}
        Use a ${tone.toLowerCase()} tone.
        Write in ${language}.
        Format the content with proper paragraphs and sections.
        Include a table of contents.
        Make sure the content is well-structured and engaging.`;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini API Response:", JSON.stringify(response.data, null, 2));

    if (
      !response.data ||
      !response.data.candidates ||
      !response.data.candidates[0].content.parts[0].text
    ) {
      throw new Error("Invalid response from Gemini API");
    }

    const generatedContent = response.data.candidates[0].content.parts[0].text;
    console.log("Generated Content:", generatedContent);

    // Generate PDF
    const pdfDoc = new PDFDocument();
    const pdfPath = path.join(
      uploadsDir,
      `${Date.now()}-${title.replace(/\s+/g, "-")}.pdf`
    );
    const pdfStream = fs.createWriteStream(pdfPath);
    pdfDoc.pipe(pdfStream);
    // Add title
    pdfDoc.fontSize(20).text(title, { align: "center" });
    pdfDoc.moveDown();
    // Add content
    pdfDoc.fontSize(12).text(generatedContent);
    pdfDoc.end();
    // Create book in database
    const book = new Book({
      title,
      author: "AI Generated",
      description: `AI-generated book about ${topic}`,
      content: generatedContent,
      length,
      topic,
      category: "Fiction", // Adding default category for AI-generated books
      keypoints: Array.isArray(keypoints)
        ? keypoints
        : keypoints
        ? keypoints.split(",").map((k) => k.trim())
        : [],
      tone,
      language,
      isAI: true,
      pdfFile: `/uploads/${path.basename(pdfPath)}`,
    });
    await book.save();
    res.json({
      success: true,
      book: {
        id: book._id,
        title: book.title,
        content: book.content,
        pdfUrl: book.pdfFile,
      },
    });
  } catch (error) {
    console.error("Error generating AI book:", error);
    res.status(500).json({
      error: "Failed to generate book",
      details: error.message,
    });
  }
});

//============================================AI template genrative============================================
app.post("/api/generate-ai-section", async (req, res) => {
  try {
      // The promptTopic is passed from the frontend's API call
      const { promptTopic } = req.body;

      if (!promptTopic) {
          return res.status(400).json({ error: "promptTopic is required" });
      }

      console.log("Generating AI section with topic:", promptTopic);

      // Construct a specific prompt for the AI
      const prompt = `Generate a detailed and engaging paragraph or short section about "${promptTopic}" for an ebook chapter. Focus on providing informative and easy-to-understand content. Limit the response to approximately 200 words.`;

      // Make the call to the Gemini API
      const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
              contents: [
                  {
                      parts: [{ text: prompt }],
                  },
              ],
          },
          {
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );

      console.log("Gemini API Response:", JSON.stringify(response.data, null, 2));

      if (
          !response.data ||
          !response.data.candidates ||
          !response.data.candidates[0].content.parts[0].text
      ) {
          throw new Error("Invalid response from Gemini API");
      }

      const generatedContent = response.data.candidates[0].content.parts[0].text;
      console.log("Generated Content:", generatedContent);

      // Send the generated content back to the frontend
      res.json({
          success: true,
          generatedContent,
      });

  } catch (error) {
      console.error("Error generating AI section:", error);
      res.status(500).json({
          error: "Failed to generate AI section",
          details: error.message,
      });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
