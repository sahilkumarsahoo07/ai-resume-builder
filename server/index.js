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
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection state
let isConnected = false;

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) throw new Error('MONGODB_URI is not defined');

        mongoose.set('bufferCommands', true);
        await mongoose.connect(mongoURI, { 
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            connectTimeoutMS: 10000 
        });
        
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (err) {
        isConnected = false;
        console.error('CRITICAL: MongoDB connection error:', err.message);
        // On Render, we want to know immediately if the DB failed
    }
};

// Middleware to check DB connection
app.use((req, res, next) => {
    if (!isConnected && req.path.startsWith('/api/') && req.path !== '/api/health') {
        return res.status(503).json({ 
            success: false, 
            message: 'Database connection is still initializing. Please try again in a few seconds.' 
        });
    }
    next();
});

connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'active',
        database: isConnected ? 'connected' : 'disconnected',
        environment: {
            node: process.env.NODE_ENV || 'development',
            mailjet: !!(process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY),
            smtp: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
            mongo: !!process.env.MONGODB_URI
        }
    });
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
