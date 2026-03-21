# MongoDB Atlas Setup Guide

## 🔗 Connect Your MongoDB Atlas Database

### Step 1: Get Your Connection String

1. **Visit MongoDB Atlas**: https://cloud.mongodb.com/v2/69bd57e5aa300a103efc7942
2. **Login** to your MongoDB Atlas account
3. **Navigate to your cluster**

### Step 2: Get Connection String

1. Click on **"Connect"** button for your cluster
2. Select **"Connect your application"**
3. Choose **"Node.js"** as driver
4. Copy the connection string

It should look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/edushare?retryWrites=true&w=majority
```

### Step 3: Update Your .env File

Replace the placeholder in your `.env` file:

```env
# Replace <username> and <password> with your actual MongoDB credentials
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/edushare?retryWrites=true&w=majority
```

### Step 4: Create Database User (If needed)

If you don't have a database user:

1. In MongoDB Atlas, go to **"Database Access"**
2. Click **"Add New Database User"**
3. Enter username and password
4. Give **"Read and write to any database"** permissions
5. Click **"Add User"**

### Step 5: Configure IP Access

1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 6: Test Connection

After updating your `.env` file, test the connection:

```bash
cd edushare-backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server running on port 5000
```

## 🔧 Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Check username and password in connection string
   - Ensure user has proper permissions

2. **IP Access Denied**
   - Add your IP address or allow access from anywhere
   - Check Network Access settings in Atlas

3. **Connection Timeout**
   - Check cluster is running
   - Verify connection string format

4. **Database Not Found**
   - The database will be created automatically on first connection
   - No need to create it manually in Atlas

### Example Working .env:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://john_doe:MyPassword123@cluster0.abcde.mongodb.net/edushare?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🚀 Ready to Go

Once your MongoDB Atlas is connected, your backend will:

- ✅ Automatically create the `edushare` database
- ✅ Create all collections (users, resources, ratings, comments)
- ✅ Start accepting API requests
- ✅ Persist data to the cloud

## 📊 Verify Connection

You can verify your data is being stored by:

1. **In MongoDB Atlas Dashboard**:
   - Go to **"Collections"**
   - You'll see `users`, `resources`, `ratings`, `comments` collections
   - Click on any collection to view the data

2. **Via API**:
   ```bash
   # Register a test user
   curl -X POST http://localhost:5000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'
   ```

## 🔒 Security Tips

- **Never commit your .env file** to version control
- **Use strong passwords** for database users
- **Limit IP access** in production environments
- **Enable SSL/TLS** (already included in connection string)

---

Your EduShare backend is now ready to use MongoDB Atlas! 🎉
