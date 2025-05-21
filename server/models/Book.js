const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Non-Fiction', 'Travel', 'Urdu', 'Children', 'Quran', 'Fiction']
    },
    length: { type: String, enum: ['Short', 'Medium', 'Long'] },
    topic: { type: String },
    keypoints: { type: [String] },
    tone: { type: String, default: 'Formal' },
    language: { type: String, default: 'English' },
    coverImage: { type: String },
    pdfFile: { type: String },
    views: { type: Number, default: 0 },
    isAI: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);