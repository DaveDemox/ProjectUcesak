# Project Ucesak - Hairstyle Recommendation System

A Node.js application for managing hairstyles and categories, with a focus on providing personalized recommendations based on hair length and face shape.

## Project Structure

```
project-ucesak/
├── server/                 # Backend server code
│   ├── abl/               # Application Business Logic
│   ├── controller/        # Request handlers
│   ├── dao/               # Data Access Objects
│   │   └── storage/       # File-based storage
│   ├── routes/            # API routes
│   ├── validators/        # Input validation
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── client/               # Frontend application (future)
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## Features

- Create and browse hairstyle recommendations
- Categorize hairstyles by length and face shape
- Like/dislike functionality for personalization
- File-based storage system
- RESTful API endpoints

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DaveDemox/ProjectUcesak.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on port 3000 by default.

## API Endpoints

### Categories

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category

### Hairstyles

- `GET /api/hairstyles` - List all hairstyles
  - Query params: `lengthCategoryId`, `faceshapeCategoryId`
- `GET /api/hairstyles/:id` - Get hairstyle by ID
- `POST /api/hairstyles` - Create new hairstyle
- `PATCH /api/hairstyles/:id/like` - Toggle like status

## Data Models

### Category
```javascript
{
  id: string,          // Unique identifier
  name: string,        // Category name
  length: string,      // "short", "medium", "long"
  faceshape: string    // "oval", "square", "round"
}
```

### Hairstyle
```javascript
{
  id: string,              // Unique identifier
  name: string,            // Hairstyle name
  lengthCategoryId: string,    // Reference to length category
  faceshapeCategoryId: string, // Reference to faceshape category
  note: string,            // Additional description
  isLiked: boolean        // Like status (true by default)
}
```

## Development

The project uses:
- Express.js for the server
- File-based storage system for data persistence
- Custom validation for data integrity
- CORS enabled for future frontend integration

## License

ISC

## Author

David Pešek