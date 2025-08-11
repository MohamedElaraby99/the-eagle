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

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Handle CORS preflight requests
app.options('*', cors());

// Add CORS headers to ALL responses - this is the most aggressive approach
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    console.log(`[CORS Middleware] ${req.method} ${req.url}`);
    console.log(`[CORS Middleware] Origin: ${origin}`);
    console.log(`[CORS Middleware] Protocol: ${req.protocol}`);
    console.log(`[CORS Middleware] Host: ${req.get('host')}`);
    
    // ALWAYS set CORS headers regardless of origin (for debugging)
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        console.log(`[CORS Middleware] Set Access-Control-Allow-Origin to: ${origin}`);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
        console.log(`[CORS Middleware] Set Access-Control-Allow-Origin to: *`);
    }
    
    // Always set these headers
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Origin, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('[CORS Middleware] Handling OPTIONS preflight request');
        res.status(204).end();
        return;
    }
    
    next();
});

// Fallback CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.CLIENT_URL,
            'http://localhost:5180',
            'https://the-eagle.fikra.solutions',
            'https://www.the-eagle.fikra.solutions',
            'https://api.the-eagle.fikra.solutions'
        ];
        
        // Check if origin is allowed
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Allow subdomains of theeagle.fikra.solutions
            if (origin.endsWith('.the-eagle.fikra.solutions')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Serve uploaded files - accessible via /api/v1/uploads/ for production
app.use('/api/v1/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  }
}));

// Backward compatibility - serve uploads on root path as well
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Test route to check uploads
app.get('/api/v1/test-uploads', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, 'uploads');
  
  try {
    const files = fs.readdirSync(uploadsDir);
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4002}`;
    
    res.json({ 
      message: 'Uploads directory accessible',
      files: files.slice(0, 10), // Show first 10 files
      uploadsPath: uploadsDir,
      apiUploadUrl: `${baseUrl}/api/v1/uploads/`,
      legacyUploadUrl: `${baseUrl}/uploads/`,
      sampleUrls: files.slice(0, 3).map(file => ({
        filename: file,
        apiUrl: `${baseUrl}/api/v1/uploads/${file}`,
        legacyUrl: `${baseUrl}/uploads/${file}`
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error accessing uploads directory',
      error: error.message
    });
  }
});

// Simple test route
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

// CORS test route
app.get('/api/cors-test', (req, res) => {
  console.log('=== CORS TEST ROUTE HIT ===');
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Origin, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.json({ 
    message: 'CORS test successful!',
    origin: req.headers.origin,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Add explicit CORS handling for problematic endpoints
app.get('/api/v1/subjects/featured', (req, res, next) => {
    console.log('[Featured Subjects] Request received');
    console.log('[Featured Subjects] Origin:', req.headers.origin);
    
    // Set CORS headers explicitly
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Origin, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    next();
});

app.get('/api/v1/courses/featured', (req, res, next) => {
    console.log('[Featured Courses] Request received');
    console.log('[Featured Courses] Origin:', req.headers.origin);
    
    // Set CORS headers explicitly
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Origin, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    next();
});

app.get('/api/v1/instructors/featured', (req, res, next) => {
    console.log('[Featured Instructors] Request received');
    console.log('[Featured Instructors] Origin:', req.headers.origin);
    
    // Set CORS headers explicitly
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Origin, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    next();
});

app.get('/api/v1/blogs', (req, res, next) => {
    console.log('[Blogs] Request received');
    console.log('[Blogs] Origin:', req.headers.origin);
    
    // Set CORS headers explicitly
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    next();
});

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
 

// Global 404 handler with CORS headers
app.all('*', (req, res) => {
    // Ensure CORS headers are set even on 404
    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Origin, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.status(404).send('OOPS!! 404 page not found');
})

app.use(errorMiddleware);

// Response interceptor to ensure CORS headers are always present
app.use((req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    const originalEnd = res.end;
    
    // Intercept res.send
    res.send = function(data) {
        ensureCorsHeaders(res, req.headers.origin);
        return originalSend.call(this, data);
    };
    
    // Intercept res.json
    res.json = function(data) {
        ensureCorsHeaders(res, req.headers.origin);
        return originalJson.call(this, data);
    };
    
    // Intercept res.end
    res.end = function(data) {
        ensureCorsHeaders(res, req.headers.origin);
        return originalEnd.call(this, data);
    };
    
    next();
});

// Helper function to ensure CORS headers
function ensureCorsHeaders(res, origin) {
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Origin, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
}

// db init
connectToDb();

export default app;