# 🚀 EduShare Complete Run Guide

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v14 or higher)
2. **MongoDB Atlas** account and connection string
3. **Git** (for version control)

## 🔧 Setup Instructions

### 1. **MongoDB Atlas Setup**

1. Visit: https://cloud.mongodb.com/v2/69bd57e5aa300a103efc7942
2. Login to your MongoDB Atlas account
3. Get your connection string:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Choose "Node.js" driver
   - Copy the connection string

4. Update the backend `.env` file:
   ```bash
   cd "edushare-backend"
   # Edit .env file with your MongoDB connection string
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/edushare?retryWrites=true&w=majority
   ```

### 2. **Install Dependencies**

#### Frontend Dependencies
```bash
cd "c:/Users/sandu/Desktop/edushare admin"
npm install
```

#### Backend Dependencies
```bash
cd "edushare-backend"
npm install
```

### 3. **Start the Applications**

#### **Start Backend Server** (Terminal 1)
```bash
cd "c:/Users/sandu/Desktop/edushare admin/edushare-backend"
npm run dev
```

**Expected Output:**
```
✅ Connected to MongoDB successfully
🚀 Server running on port 5000
📝 Environment: development
```

#### **Start Frontend Application** (Terminal 2)
```bash
cd "c:/Users/sandu/Desktop/edushare admin"
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view edushare-admin in the browser.
  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.100:3000
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 👤 Admin Access

### 1. **Register as Admin**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@edushare.com",
    "password": "Admin123!",
    "role": "admin"
  }'
```

### 2. **Login and Get Token**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@edushare.com",
    "password": "Admin123!"
  }'
```

### 3. **Access Admin Dashboard**
- Open http://localhost:3000 in browser
- Login with admin credentials
- Navigate to Admin Dashboard

## 🎯 Navigation Guide

### **Frontend Routes**
- `/` - Home Page (Resource Listing)
- `/resource/:id` - Resource Detail Page
- `/dashboard` - Student Dashboard
- `/admin` - Admin Dashboard

### **Admin Dashboard Tabs**
1. **Overview** - Platform statistics and charts
2. **Users** - User management with search and filters
3. **Resources** - Resource management and approval
4. **Comments** - Comment moderation
5. **Analytics** - Detailed analytics and insights

## 🔍 Testing the Application

### **1. Test API Endpoints**

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Get Dashboard Stats (Admin Only)
```bash
# First login to get token, then:
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **2. Test Frontend Features**

1. **Resource Management**
   - Upload new resources
   - Search and filter resources
   - Rate and comment on resources

2. **User Management**
   - Register new users
   - View user profiles
   - Check badge system

3. **Admin Functions**
   - View dashboard statistics
   - Manage users and resources
   - Moderate comments

## 🛠️ Common Issues & Solutions

### **MongoDB Connection Issues**
```bash
# Error: "MongoServerError: bad auth"
# Solution: Check username and password in connection string

# Error: "MongoNetworkError: connection failed"
# Solution: Check IP access in MongoDB Atlas (allow 0.0.0.0/0)
```

### **Port Already in Use**
```bash
# Error: "Port 3000 is already in use"
# Solution: Kill the process or use different port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **TypeScript Errors**
```bash
# Error: "Cannot find module 'lucide-react'"
# Solution: Install types
npm install --save-dev @types/lucide-react
```

### **CORS Issues**
```bash
# Error: "CORS policy: No 'Access-Control-Allow-Origin'"
# Solution: Backend CORS is configured, ensure frontend URL is correct
```

## 📊 Database Collections

After running the application, MongoDB Atlas will show these collections:

- **users** - User accounts and profiles
- **resources** - Academic resources and files
- **ratings** - User ratings for resources
- **comments** - User comments and feedback

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edushare
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (src/utils/api.ts)
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🚀 Production Deployment

### **Backend Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy build folder to hosting service
```

## 📱 Mobile Responsiveness

The application is fully responsive:
- **Desktop**: Full functionality with all features
- **Tablet**: Optimized layout with touch interactions
- **Mobile**: Simplified navigation and compact views

## 🎨 Customization

### **Colors and Themes**
Edit `tailwind.config.js` to customize:
- Primary colors
- Font families
- Animation durations

### **API Configuration**
Edit `src/utils/api.ts` to change:
- Backend URL
- Request timeouts
- Error handling

## 📞 Support

If you encounter issues:

1. **Check logs** in both frontend and backend terminals
2. **Verify MongoDB connection** in Atlas dashboard
3. **Ensure all dependencies** are installed
4. **Check environment variables** are correct

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend starts with MongoDB connection success  
✅ Frontend loads without errors  
✅ Admin dashboard shows statistics  
✅ Users can register and login  
✅ Resources can be uploaded and viewed  
✅ All navigation works smoothly  

---

**Happy Coding! 🚀**
