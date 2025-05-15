const express = require('express');
const cors = require('cors');
const hairstyleRoutes = require('./routes/hairstyle-routes');
const lengthCategoryRoutes = require('./routes/length-category-routes');
const faceShapeCategoryRoutes = require('./routes/faceshape-category-routes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/hairstyles/length-categories', lengthCategoryRoutes);
app.use('/api/hairstyles/faceshape-categories', faceShapeCategoryRoutes);
app.use('/api/hairstyles', hairstyleRoutes);

// Serve images statically
app.use('/images', express.static(path.join(__dirname, 'dao', 'storage', 'hairstyleImages')));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- GET /api/hairstyles');
    console.log('- POST /api/hairstyles');
    console.log('- GET /api/hairstyles/length-categories');
    console.log('- GET /api/hairstyles/faceshape-categories');
}); 