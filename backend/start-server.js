// Simple server startup script with debugging
import app from "./app.js";

const PORT = process.env.PORT || 4003;

console.log('🚀 Starting The Eagle Backend Server...');
console.log('==========================================');
console.log(`📡 Port: ${PORT}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

// Check if port is available
import net from 'net';

function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.close();
            resolve(true);
        });
        server.on('error', () => {
            resolve(false);
        });
    });
}

async function startServer() {
    try {
        // Check if port is available
        const portAvailable = await isPortAvailable(PORT);
        if (!portAvailable) {
            console.error(`❌ Port ${PORT} is already in use!`);
            console.log('💡 Try these solutions:');
            console.log('   1. Kill any existing processes on port', PORT);
            console.log('   2. Use a different port: PORT=4003 npm run dev');
            console.log('   3. Check what\'s using the port: netstat -tlnp | grep :', PORT);
            process.exit(1);
        }

        console.log(`✅ Port ${PORT} is available`);

        // Start the server
        const server = app.listen(PORT, () => {
            console.log(`🎉 Server started successfully!`);
            console.log(`🌐 Local: http://localhost:${PORT}`);
            console.log(`🔗 Network: http://0.0.0.0:${PORT}`);
            console.log(`📊 Health Check: http://localhost:${PORT}/api/test`);
            console.log(`🔒 CORS Test: http://localhost:${PORT}/api/cors-test`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use!`);
                console.log('💡 Try stopping other services or use a different port');
            } else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down server...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Shutting down server...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
