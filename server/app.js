const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/categories', require('./controller/categoryController'));
app.use('/api/hairstyles', require('./controller/hairstyleController'));

// Root route
app.get('/', (req, res) => {
    res.send('Hairstyle Recommendation System');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; 