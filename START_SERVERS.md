# How to Start the Application

## Prerequisites
- MongoDB must be running on your system
- Node.js and npm installed

## Starting the Application

### Method 1: Manual Start (Recommended for Development)

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
```
You should see:
- `Server running on port 5000`
- `MongoDB Connected`

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm run dev
```
You should see:
- `Local: http://localhost:5173/` (or similar)

### Method 2: Using the Startup Script

**PowerShell:**
```powershell
.\start-dev.ps1
```

## Verifying Everything Works

### 1. Check Backend Server
Open browser and go to: `http://localhost:5000`
You should see: "DreamRoute API is running"

### 2. Check Frontend
Open browser and go to: `http://localhost:5173` (or the URL shown in terminal)

### 3. Test Registration
1. Go to the Register page
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. You should see: "Registered successfully! Redirecting to login..."

### 4. Verify User in Database
Run this command to check registered users:
```bash
cd server
node check-users.js
```

## Troubleshooting

### Registration Not Working?
1. **Check if backend server is running**
   - Look for "Server running on port 5000" in Terminal 1
   - Visit `http://localhost:5000` - should show "DreamRoute API is running"

2. **Check MongoDB connection**
   - Make sure MongoDB is running on your system
   - Check for "MongoDB Connected" message in backend terminal

3. **Check browser console**
   - Press F12 in browser
   - Look for any error messages in Console tab
   - Check Network tab for failed requests

4. **Check backend logs**
   - Look at Terminal 1 (backend) for any error messages

### Common Issues

**Issue: "Network Error" or "Failed to fetch"**
- **Solution:** Backend server is not running. Start it with `cd server && npm start`

**Issue: "MongoDB Connection Error"**
- **Solution:** Make sure MongoDB is installed and running
- Start MongoDB service on your system

**Issue: "Port 5000 already in use"**
- **Solution:** Another process is using port 5000
- Either stop that process or change PORT in `server/.env`

**Issue: "User already exists"**
- **Solution:** That email is already registered
- Try a different email or login with existing credentials

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Testing API Directly
You can test the registration endpoint directly:
```bash
cd server
node debug-register.js
```

This will create a test user and show you the response.
