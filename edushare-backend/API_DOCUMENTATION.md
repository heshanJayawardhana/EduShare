# EduShare Backend API Documentation

## Overview

EduShare Backend API provides endpoints for managing academic resources, users, ratings, and comments. Built with Node.js, Express.js, and MongoDB.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "student" // optional, defaults to "student"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3b",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "badge": "Bronze"
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3b",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "badge": "Bronze",
    "uploadCount": 5,
    "totalDownloads": 150,
    "totalEarnings": 75.50,
    "averageRating": 4.2
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3b",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "badge": "Silver",
    "uploadCount": 25,
    "totalDownloads": 500,
    "totalEarnings": 250.00,
    "averageRating": 4.5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Resources

#### Get All Resources
```http
GET /api/resources
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `faculty` (string): Filter by faculty
- `academicYear` (string): Filter by academic year
- `search` (string): Search in title and description
- `sortBy` (string): Sort field (createdAt, downloads, averageRating)
- `sortOrder` (string): Sort order (asc, desc)

**Response (200):**
```json
{
  "resources": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3b",
      "title": "Advanced Calculus Notes",
      "description": "Comprehensive notes on differential and integral calculus...",
      "fileUrl": "https://example.com/files/calculus.pdf",
      "fileName": "calculus.pdf",
      "fileSize": 2048576,
      "fileType": "pdf",
      "category": "Mathematics",
      "faculty": "Science",
      "academicYear": "2024",
      "price": 15.99,
      "downloads": 150,
      "averageRating": 4.5,
      "ratingCount": 25,
      "tags": ["calculus", "mathematics", "derivatives"],
      "uploaderId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3c",
      "isApproved": true,
      "isPublic": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "uploader": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3c",
        "name": "Dr. Sarah Johnson",
        "email": "sarah@university.edu",
        "badge": "Gold"
      }
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 48,
    "limit": 10
  }
}
```

#### Get Resource by ID
```http
GET /api/resources/:id
```

**Response (200):**
```json
{
  "resource": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3b",
    "title": "Advanced Calculus Notes",
    "description": "Comprehensive notes on differential and integral calculus...",
    "fileUrl": "https://example.com/files/calculus.pdf",
    "uploader": {
      "name": "Dr. Sarah Johnson",
      "email": "sarah@university.edu",
      "badge": "Gold"
    },
    "ratings": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4d",
        "userId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3e",
        "rating": 5,
        "createdAt": "2024-01-16T14:30:00.000Z",
        "user": {
          "name": "Mike Chen",
          "badge": "Silver"
        }
      }
    ]
  }
}
```

#### Create Resource
```http
POST /api/resources
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Physics Lab Manual",
  "description": "Complete laboratory manual for undergraduate physics...",
  "fileUrl": "https://example.com/files/physics-lab.pdf",
  "fileName": "physics-lab.pdf",
  "fileSize": 3072000,
  "fileType": "pdf",
  "category": "Physics",
  "faculty": "Science",
  "academicYear": "2024",
  "price": 12.50,
  "tags": ["physics", "laboratory", "experiments"]
}
```

**Response (201):**
```json
{
  "message": "Resource created successfully",
  "resource": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4e",
    "title": "Physics Lab Manual",
    "description": "Complete laboratory manual for undergraduate physics...",
    "uploader": {
      "name": "John Doe",
      "email": "john@example.com",
      "badge": "Bronze"
    }
  }
}
```

#### Download Resource
```http
POST /api/resources/:id/download
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Download recorded successfully",
  "fileUrl": "https://example.com/files/physics-lab.pdf",
  "fileName": "physics-lab.pdf",
  "downloads": 151
}
```

### Ratings

#### Create/Update Rating
```http
POST /api/ratings
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "resourceId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4e",
  "rating": 5
}
```

**Response (200):**
```json
{
  "message": "Rating updated successfully",
  "rating": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a5f",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3c",
    "resourceId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4e",
    "rating": 5,
    "createdAt": "2024-01-17T09:15:00.000Z"
  }
}
```

#### Get Resource Ratings
```http
GET /api/ratings/:resourceId
```

**Response (200):**
```json
{
  "stats": {
    "averageRating": 4.3,
    "totalRatings": 25,
    "ratingDistribution": {
      "1": 1,
      "2": 2,
      "3": 5,
      "4": 8,
      "5": 9
    }
  },
  "ratings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a5f",
      "userId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4d",
      "resourceId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4e",
      "rating": 5,
      "createdAt": "2024-01-17T09:15:00.000Z",
      "user": {
        "name": "Mike Chen",
        "badge": "Silver"
      }
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 3,
    "total": 25,
    "limit": 10
  }
}
```

### Comments

#### Create Comment
```http
POST /api/comments
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "resourceId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4e",
  "content": "Excellent resource! Very helpful for my studies.",
  "rating": 5,
  "parentCommentId": null // for replies, include parent comment ID
}
```

**Response (201):**
```json
{
  "message": "Comment created successfully",
  "comment": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a6g",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a3c",
    "resourceId": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a4e",
    "content": "Excellent resource! Very helpful for my studies.",
    "rating": 5,
    "isPositive": true,
    "createdAt": "2024-01-18T14:30:00.000Z",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "badge": "Bronze"
    }
  }
}
```

#### Get Resource Comments
```http
GET /api/comments/:resourceId
```

**Response (200):**
```json
{
  "comments": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a6g",
      "content": "Excellent resource! Very helpful for my studies.",
      "rating": 5,
      "isPositive": true,
      "createdAt": "2024-01-18T14:30:00.000Z",
      "user": {
        "name": "John Doe",
        "badge": "Bronze"
      },
      "replies": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0e1f2a6h",
          "content": "I agree! Very comprehensive.",
          "rating": 4,
          "user": {
            "name": "Jane Smith",
            "badge": "Silver"
          }
        }
      ]
    }
  ],
  "stats": {
    "totalComments": 15,
    "positiveComments": 12,
    "negativeComments": 3,
    "positivePercentage": 80,
    "averageRating": 4.2
  },
  "pagination": {
    "current": 1,
    "pages": 2,
    "total": 15,
    "limit": 10
  }
}
```

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /api/admin/dashboard
```

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**
```json
{
  "users": {
    "totalUsers": 1250,
    "bronzeUsers": 800,
    "silverUsers": 300,
    "goldUsers": 150,
    "totalUploads": 2500,
    "totalDownloads": 15000,
    "totalEarnings": 5000,
    "avgRating": 4.2
  },
  "resources": {
    "totalResources": 500,
    "totalDownloads": 15000,
    "averageRating": 4.3,
    "totalRatingCount": 2500
  },
  "comments": {
    "totalComments": 750,
    "positiveComments": 600,
    "negativeComments": 150,
    "reportedComments": 5,
    "positivePercentage": 80
  },
  "ratings": {
    "totalRatings": 2500,
    "averageRating": 4.3,
    "ratingDistribution": {
      "1": 50,
      "2": 100,
      "3": 350,
      "4": 800,
      "5": 1200
    }
  },
  "monthlyStats": [
    {
      "month": "Jan",
      "year": 2024,
      "resources": 45,
      "downloads": 1200
    },
    {
      "month": "Feb",
      "year": 2024,
      "resources": 52,
      "downloads": 1450
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)
```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Access denied. Invalid token."
}
```

### Authorization Error (403)
```json
{
  "error": "Access denied. Insufficient permissions."
}
```

### Not Found Error (404)
```json
{
  "error": "Resource not found"
}
```

### Internal Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API is rate-limited to 100 requests per 15 minutes per IP address.

## Badge System

Users automatically earn badges based on upload count:
- **Bronze**: 0-9 uploads
- **Silver**: 10-24 uploads  
- **Gold**: 25+ uploads

## Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string", // hashed
  "role": "student|admin",
  "badge": "Bronze|Silver|Gold",
  "uploadCount": "number",
  "totalDownloads": "number",
  "totalEarnings": "number",
  "averageRating": "number",
  "avatar": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Resource Model
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "fileUrl": "string",
  "fileName": "string",
  "fileSize": "number",
  "fileType": "string",
  "uploaderId": "ObjectId",
  "category": "string",
  "faculty": "string",
  "academicYear": "string",
  "price": "number",
  "downloads": "number",
  "averageRating": "number",
  "ratingCount": "number",
  "tags": ["string"],
  "isApproved": "boolean",
  "isPublic": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Rating Model
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "resourceId": "ObjectId",
  "rating": "number", // 1-5
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Comment Model
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "resourceId": "ObjectId",
  "content": "string",
  "rating": "number", // 1-5
  "isPositive": "boolean",
  "isReported": "boolean",
  "isDeleted": "boolean",
  "parentCommentId": "ObjectId", // for replies
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Testing

Use the provided test data or create your own using the registration endpoint.

## Support

For API support and questions, please contact the development team.
