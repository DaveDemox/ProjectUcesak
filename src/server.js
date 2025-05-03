const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const categoryRoutes = require('./routes/categoryRoutes');
const hairstyleRoutes = require('./routes/hairstyleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/hairstyles', hairstyleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}); 