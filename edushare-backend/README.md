# EduShare Backend API

A scalable REST API for the EduShare Academic Resource Hub, built with Node.js, Express.js, and MongoDB.

## 🚀 Features

### Core Functionality
- **JWT Authentication**: Secure user authentication with role-based access control
- **User Management**: Registration, login, profile management with badge system
- **Resource Management**: CRUD operations with advanced filtering and search
- **Rating System**: 5-star rating system with duplicate prevention
- **Comment System**: Nested comments with sentiment analysis and reporting
- **Admin Dashboard**: Comprehensive analytics and content moderation
- **File Upload Support**: Multiple file formats with size tracking

### Business Logic
- **Automatic Badge System**: Bronze (10 uploads), Silver (25 uploads), Gold (50+ uploads)
- **Rating Calculations**: Real-time average rating updates
- **Comment Analysis**: Automatic positive/negative sentiment detection
- **Download Tracking**: Per-resource and per-user download statistics
- **Search & Filtering**: Full-text search with multiple filter options

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **Environment**: dotenv

## 📁 Project Structure

```
edushare-backend/
├── models/                 # Mongoose data models
│   ├── User.js           # User model with badge system
│   ├── Resource.js        # Resource model with relationships
│   ├── Rating.js          # Rating model with validation
│   └── Comment.js         # Comment model with replies
├── controllers/            # Business logic handlers
│   ├── authController.js   # Authentication logic
│   ├── resourceController.js # Resource CRUD operations
│   ├── ratingController.js # Rating management
│   ├── commentController.js # Comment management
│   └── adminController.js # Admin operations
├── routes/                # API route definitions
│   ├── auth.js           # Authentication routes
│   ├── resources.js      # Resource routes
│   ├── ratings.js        # Rating routes
│   ├── comments.js       # Comment routes
│   └── admin.js         # Admin routes
├── middleware/            # Custom middleware
│   └── auth.js          # JWT authentication & authorization
├── utils/                # Utility functions
│   ├── jwt.js           # JWT token management
│   └── validation.js    # Request validation rules
├── .env                 # Environment variables
├── server.js             # Express app entry point
└── package.json          # Dependencies and scripts
```

## 🚦 Installation

### Prerequisites
- Node.js 14+ 
- MongoDB 4.4+
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edushare-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/edushare

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Database Setup

The application will automatically create the necessary collections in MongoDB on first run.

## 📊 Database Models

### User Model
```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email address
  password: String,       // Hashed password
  role: String,          // 'student' | 'admin'
  badge: String,         // 'Bronze' | 'Silver' | 'Gold'
  uploadCount: Number,    // Number of resources uploaded
  totalDownloads: Number, // Total downloads of user's resources
  totalEarnings: Number, // Total earnings from paid resources
  averageRating: Number,  // Average rating of user's resources
  avatar: String         // Profile image URL
}
```

### Resource Model
```javascript
{
  title: String,         // Resource title
  description: String,   // Detailed description
  fileUrl: String,      // File storage URL
  fileName: String,     // Original file name
  fileSize: Number,     // File size in bytes
  fileType: String,     // File extension
  uploaderId: ObjectId, // Reference to User
  category: String,     // Academic category
  faculty: String,      // Faculty/Department
  academicYear: String, // Academic year
  price: Number,        // Resource price (0 = free)
  downloads: Number,     // Download count
  averageRating: Number, // Average user rating
  ratingCount: Number,  // Number of ratings
  tags: [String],       // Search tags
  isApproved: Boolean,  // Admin approval status
  isPublic: Boolean     // Public visibility
}
```

### Rating Model
```javascript
{
  userId: ObjectId,      // User who rated
  resourceId: ObjectId,  // Resource being rated
  rating: Number,        // 1-5 star rating
  createdAt: Date        // Rating timestamp
}
```

### Comment Model
```javascript
{
  userId: ObjectId,        // Comment author
  resourceId: ObjectId,    // Related resource
  content: String,        // Comment text
  rating: Number,         // Associated rating (1-5)
  isPositive: Boolean,     // Sentiment analysis result
  isReported: Boolean,    // Reported by users
  isDeleted: Boolean,     // Soft delete flag
  parentCommentId: ObjectId // For nested replies
}
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Resources
- `GET /api/resources` - Get all resources (with filters)
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (auth required)
- `PUT /api/resources/:id` - Update resource (auth required)
- `DELETE /api/resources/:id` - Delete resource (auth required)
- `POST /api/resources/:id/download` - Record download
- `GET /api/resources/my` - Get user's resources

### Ratings
- `POST /api/ratings` - Create/update rating
- `GET /api/ratings/:resourceId` - Get resource ratings
- `GET /api/ratings/user/:resourceId` - Get user's rating
- `PUT /api/ratings/:resourceId` - Update rating
- `DELETE /api/ratings/:resourceId` - Delete rating
- `GET /api/ratings/history` - Get rating history

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/:resourceId` - Get resource comments
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/report` - Report comment
- `POST /api/comments/:id/reply` - Reply to comment
- `GET /api/comments/history` - Get comment history

### Admin (Admin Only)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/resources` - Manage resources
- `GET /api/admin/comments` - Manage comments
- `DELETE /api/admin/comment/:id` - Delete comment
- `PUT /api/admin/resource/:id/approve` - Approve/reject resource
- `PUT /api/admin/user/:id/badge` - Update user badge
- `GET /api/admin/analytics` - System analytics

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (student/admin)
- Password hashing with bcrypt
- Token expiration handling

### Request Security
- Rate limiting (100 requests/15 minutes)
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- SQL injection prevention (via Mongoose)

### Data Protection
- Password never returned in responses
- Sensitive data filtering
- Secure file handling
- Environment variable protection

## 📈 Business Logic Implementation

### Badge System
```javascript
// Automatic badge calculation
if (uploadCount >= 50) badge = 'Gold';
else if (uploadCount >= 25) badge = 'Silver';
else badge = 'Bronze';
```

### Rating Prevention
```javascript
// Prevent duplicate ratings per user per resource
ratingSchema.index({ userId: 1, resourceId: 1 }, { unique: true });
```

### Comment Sentiment
```javascript
// Automatic positive/negative detection
isPositive = rating >= 3;
```

### Statistics Calculation
```javascript
// Real-time dashboard statistics
const stats = await User.getStats(); // Aggregated user data
const resourceStats = await Resource.getStats(); // Resource analytics
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Data
Use the provided test endpoints or create test data:
- Register test users
- Upload sample resources
- Add ratings and comments
- Test admin functionality

## 📝 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation including:
- All endpoints with methods
- Request/response examples
- Error handling
- Authentication requirements
- Rate limiting information

## 🚀 Deployment

### Production Setup

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-production-secret
   ```

2. **Database Connection**
   ```bash
   # Ensure MongoDB is accessible
   # Create database user with appropriate permissions
   ```

3. **Start Application**
   ```bash
   npm start
   ```

### Docker Deployment
```bash
# Build image
docker build -t edushare-backend .

# Run container
docker run -p 5000:5000 edushare-backend
```

## 🔧 Development

### Adding New Endpoints

1. Create controller function in `controllers/`
2. Add validation rules in `utils/validation.js`
3. Define route in `routes/`
4. Add middleware if needed in `middleware/`
5. Update documentation

### Database Changes

1. Update or create model in `models/`
2. Add indexes for performance
3. Include validation rules
4. Test with sample data

## 📊 Monitoring & Logging

### Application Logs
```bash
# Development: Detailed logging with Morgan
# Production: Error logging only
```

### Health Check
```bash
GET /api/health
# Returns server status and timestamp
```

### Performance Monitoring
- Response time tracking
- Database query optimization
- Memory usage monitoring
- Error rate tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Follow coding standards
5. Submit pull request

### Coding Standards
- Use ES6+ features
- Follow JSDoc documentation
- Implement error handling
- Add input validation
- Write unit tests

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments
- Contact the development team

---

**Built with ❤️ for the academic community**
