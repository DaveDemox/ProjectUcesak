const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const hairstyleRoutes = require('./routes/hairstyleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/hairstyles', hairstyleRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 