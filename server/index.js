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
let lastDBError = null;

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) throw new Error('MONGODB_URI is not defined in environment variables');

        const maskedURI = mongoURI.replace(/:([^@]+)@/, ':****@');
        console.log(`[DB] Attempting to connect to: ${maskedURI}`);
        // Disable buffering so we don't hang requests
        mongoose.set('bufferCommands', false); 
        
        await mongoose.connect(mongoURI, { 
            serverSelectionTimeoutMS: 10000, // 10 seconds to find server
            connectTimeoutMS: 20000,        // 20 seconds to establish connection
        });
        
        isConnected = true;
        lastDBError = null;
        console.log('[DB] MongoDB connected successfully');
    } catch (err) {
        isConnected = false;
        lastDBError = err.message;
        console.error('[DB] CRITICAL CONNECTION ERROR:', err.message);
    }
};

// Middleware to check DB connection
app.use((req, res, next) => {
    // Skip check for health or if it's not an API route
    if (req.path === '/api/health' || !req.path.startsWith('/api/')) {
        return next();
    }

    if (!isConnected) {
        return res.status(503).json({ 
            success: false, 
            message: 'Database is not connected. Check /api/health for details.',
            error: lastDBError 
        });
    }
    next();
});

connectDB();

// Root route for Render health check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'server-active' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'active',
        database: isConnected ? 'connected' : 'disconnected',
        error: lastDBError,
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

// Production Readiness Check
const checkReady = () => {
    console.log('\n--- Production Readiness Check ---');
    const required = {
        MONGODB_URI: !!process.env.MONGODB_URI,
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        MAILJET_API_KEY: !!process.env.MAILJET_API_KEY,
        GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID
    };
    
    Object.entries(required).forEach(([key, present]) => {
        console.log(`${present ? '✅' : '❌'} ${key}: ${present ? 'Configured' : 'MISSING'}`);
    });

    if (!required.RESEND_API_KEY && !required.MAILJET_API_KEY) {
        console.log('⚠️ WARNING: No production email service (Resend/Mailjet) configured. OTP will fail on Render.');
    }
    console.log('---------------------------------\n');
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (Bound to 0.0.0.0)`);
    checkReady();
});
