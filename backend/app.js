import { configDotenv } from 'dotenv';
configDotenv();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js'; 
import courseRoutes from './routes/course.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import miscellaneousRoutes from './routes/miscellaneous.routes.js';
import blogRoutes from './routes/blog.routes.js';
import qaRoutes from './routes/qa.routes.js';
import subjectRoutes from './routes/subject.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import adminRechargeCodeRoutes from './routes/adminRechargeCode.routes.js';
import adminUserRoutes from './routes/adminUser.routes.js';
import whatsappServiceRoutes from './routes/whatsappService.routes.js';
import pdfConverterRoutes from './routes/pdfConverter.routes.js';
import examRoutes from './routes/exam.routes.js';
import examResultsRoutes from './routes/examResults.routes.js';
import videoProgressRoutes from './routes/videoProgress.routes.js';
import deviceManagementRoutes from './routes/deviceManagement.routes.js';
import liveMeetingRoutes from './routes/liveMeeting.routes.js';
import captchaRoutes from './routes/captcha.routes.js';

import gradeRoutes from './routes/grade.routes.js';
import instructorRoutes from './routes/instructor.routes.js';
import stageRoutes from './routes/stage.routes.js';
import express from 'express';
import connectToDb from './config/db.config.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// CORS Configuration - Clean and Simple
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5180',
            'https://the-eagle.fikra.solutions',
            'https://www.the-eagle.fikra.solutions',
            'https://api.the-eagle.fikra.solutions'
        ];
        
        // Check if origin is allowed
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Allow subdomains of the-eagle.fikra.solutions
            if (origin.endsWith('.the-eagle.fikra.solutions')) {
                callback(null, true);
            } else {
                console.log(`🚫 CORS blocked origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Serve uploaded files
app.use('/api/v1/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Cache-Control', 'public, max-age=31536000');
    }
}));

// Backward compatibility
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Cache-Control', 'public, max-age=31536000');
    }
}));

// Test routes
app.get('/api/test', (req, res) => {
    console.log('=== API TEST ROUTE HIT ===');
    console.log('Origin:', req.headers.origin);
    console.log('User-Agent:', req.headers['user-agent']);
    res.json({ 
        message: 'API is working!',
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/cors-test', (req, res) => {
    console.log('=== CORS TEST ROUTE HIT ===');
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', req.headers);
    
    res.json({ 
        message: 'CORS test successful!',
        origin: req.headers.origin,
        headers: req.headers,
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
console.log('Payment routes registered at /api/v1/payments');
app.use('/api/v1/', miscellaneousRoutes);
app.use('/api/v1/', blogRoutes);
app.use('/api/v1/', qaRoutes);
app.use('/api/v1/', subjectRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/admin/recharge-codes', adminRechargeCodeRoutes);
app.use('/api/v1/admin/users', adminUserRoutes);
app.use('/api/v1/whatsapp-services', whatsappServiceRoutes);
app.use('/api/v1/pdf-converter', pdfConverterRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/exam-results', examResultsRoutes);
app.use('/api/v1/video-progress', videoProgressRoutes);
app.use('/api/v1/device-management', deviceManagementRoutes);
app.use('/api/v1/live-meetings', liveMeetingRoutes);
app.use('/api/v1/captcha', captchaRoutes);

app.use('/api/v1/grades', gradeRoutes);
app.use('/api/v1/instructors', instructorRoutes);
app.use('/api/v1/stages', stageRoutes);

// Global 404 handler
app.all('*', (req, res) => {
    res.status(404).send('OOPS!! 404 page not found');
});

app.use(errorMiddleware);

// db init - make it non-blocking
setTimeout(() => {
    try {
        connectToDb();
    } catch (error) {
        console.log('⚠️ MongoDB connection failed, but server continues running');
        console.log('💡 You can still test CORS and basic functionality');
    }
}, 1000);

export default app;