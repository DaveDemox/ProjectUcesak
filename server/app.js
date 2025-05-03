const express = require('express');
const cors = require('cors');
const app = express();
const categoryController = require('./controller/categoryController');
const hairstyleController = require('./controller/hairstyleController');

console.log('Initializing Express app...');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.send('Hairstyle Recommendation System');
});

console.log('Setting up routes...');
app.use('/api/categories', categoryController);
app.use('/api/hairstyles', hairstyleController);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        code: "serverError",
        message: err.message
    });
});

// Start server
const PORT = 3000;
const HOST = '127.0.0.1';

console.log('Starting server...');
console.log(`Attempting to listen on ${HOST}:${PORT}`);

try {
    const server = app.listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
        console.log('Press Ctrl+C to stop the server');
    });

    server.on('error', (error) => {
        console.error('Server error:', error);
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
        }
        process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
} 