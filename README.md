# Hairstyle Management System

A Node.js backend application for managing hairstyles and their categories. The system allows users to categorize hairstyles based on length and face shape, making it easier to find suitable hairstyles for different face shapes and length preferences.

## Features

- CRUD operations for hairstyles and categories
- Categorization by length (short, medium, long) and face shape (oval, square, round)
- Input validation using AJV
- MongoDB database integration
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DaveDemox/ProjectUcesak.git
cd ProjectUcesak
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/hairstyleDB
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── dao/           # Data access objects
├── models/        # Database models
├── routes/        # API routes
├── validators/    # Input validation schemas
└── app.js         # Main application file
```

## API Documentation

### Categories

#### List Categories
- **GET** `/api/categories`
- Returns all categories

#### Create Category
- **POST** `/api/categories`
- Request body:
```json
{
  "name": "Short",
  "length": "short",
  "faceshape": "oval"
}
```

### Hairstyles

#### List Hairstyles
- **GET** `/api/hairstyles`
- Optional query parameters:
  - `lengthCategoryId`: Filter by length category
  - `faceshapeCategoryId`: Filter by face shape category

#### Create Hairstyle
- **POST** `/api/hairstyles`
- Request body:
```json
{
  "name": "Bob Cut",
  "lengthCategoryId": "123",
  "faceshapeCategoryId": "456",
  "note": "Modern bob cut with layers"
}
```

## Data Models

### Category
```javascript
{
  id: String,
  name: String,        // required, unique
  length: String,      // required, enum: ["short", "medium", "long"]
  faceshape: String    // required, enum: ["oval", "square", "round"]
}
```

### Hairstyle
```javascript
{
  id: String,
  name: String,              // required
  lengthCategoryId: String,  // required, references Category
  faceshapeCategoryId: String, // required, references Category
  note: String               // optional
}
```

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Build for production: `npm run build`

## License

free

## Author

David Pešek