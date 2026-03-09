import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
// Load environment variables
dotenv.config();

// Debug: Log environment status (without exposing full keys)
const apiKey = process.env.OPENROUTER_API_KEY;
console.log('[Config] API Key present:', !!apiKey);
console.log('[Config] API Key valid:', apiKey && !apiKey.includes('your_') && apiKey.length > 20);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-builder';
        mongoose.set('bufferCommands', false); // Disable buffering so we catch errors immediately
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error (Non-fatal in dev):', err.message);
        console.log('API will run in Mock Mode for Guest user.');
    }
};

connectDB();

// Basic Route for health check
app.get('/', (req, res) => {
    res.send('AI Resume Builder API is running');
});

// Import and use routes here
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (Bound to 0.0.0.0)`);
});
