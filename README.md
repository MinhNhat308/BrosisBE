# Blog API

A RESTful API for managing blog posts built with Express.js, TypeScript, and Prisma.

## Features

- CRUD operations for blog posts
- MySQL database with Prisma ORM
- TypeScript for type safety
- Error handling middleware
- CORS support
- Graceful shutdown

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   PORT=3000
   FE_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

5. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

6. Push database schema:
   ```bash
   npm run db:push
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Get all blogs
- **GET** `/blog`
- Returns array of all blog posts

### Get blog by ID
- **GET** `/blog/:id`
- Returns a single blog post

### Create new blog
- **POST** `/blog`
- Body:
  ```json
  {
    "title": "Blog Title",
    "content": "Blog content",
    "author": "Author Name" // optional
  }
  ```

### Update blog
- **PUT** `/blog/:id`
- Body:
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content",
    "author": "Updated Author" // optional
  }
  ```

### Delete blog
- **DELETE** `/blog/:id`
- Deletes the specified blog post

## Database Schema

```sql
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors (400)
- Not found errors (404)
- Database constraint violations (409)
- Internal server errors (500)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
