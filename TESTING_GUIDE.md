# 🧪 Backend Testing Guide

## Quick Start

### 1. Make sure MongoDB is running
```bash
# Check if MongoDB is running (Windows)
# MongoDB should be running on mongodb://localhost:27017
```

### 2. Make sure the server is running
```bash
cd server
npm run dev
# Server should start on http://localhost:5000
```

### 3. Make sure the client is running
```bash
cd client
npm run dev
# Client should start on http://localhost:5173 (or similar)
```

## 🎯 Manual Testing Steps

### Test 1: User Registration
1. Open the website in your browser
2. Click on "Sign Up" or navigate to `/signup`
3. Fill in the registration form:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
4. Click "Register"
5. ✅ You should be redirected to the dashboard
6. ✅ Check browser console - user data should be in localStorage
7. ✅ Check MongoDB - new user should be in the `users` collection

**What happens in the backend:**
- POST request to `/api/auth/signup`
- Password is hashed with bcrypt
- User is saved to MongoDB
- JWT token is generated
- Token and user data returned to frontend

### Test 2: User Login
1. If logged in, logout first
2. Navigate to `/login`
3. Enter credentials:
   - Email: test@example.com
   - Password: password123
4. Click "Login"
5. ✅ You should be redirected to the dashboard
6. ✅ User data should be in localStorage

**What happens in the backend:**
- POST request to `/api/auth/signin`
- Email is verified
- Password is compared with hashed password
- JWT token generated on success
- Token and user data returned

### Test 3: Create a Booking
1. Make sure you're logged in
2. Navigate to home page
3. Click on any listing/destination
4. Click "Book Now" or similar
5. Fill in booking details:
   - Check-in date
   - Check-out date
   - Number of guests
6. Click "Continue to Checkout"
7. Fill in guest information:
   - First Name
   - Last Name
   - Email
   - Phone
8. Click "Continue to Payment"
9. Fill in payment details (dummy data):
   - Card Number: 4111 1111 1111 1111
   - Expiry: 12/25
   - CVC: 123
   - Name: Test User
10. Click "Confirm and Pay"
11. ✅ You should see a success message
12. ✅ Booking should appear in your dashboard
13. ✅ Check MongoDB - new booking in `bookings` collection

**What happens in the backend:**
- POST request to `/api/bookings/new`
- Listing availability is checked
- Payment is simulated (95% success rate)
- Booking is created with all details
- Booking reference is generated (e.g., BK1733123456ABC)
- Payment ID is generated (e.g., PAY_1733123456XYZ)
- Stock is decremented
- Booking is saved to MongoDB
- Response sent back with booking details

### Test 4: View Bookings in Dashboard
1. Navigate to `/dashboard`
2. ✅ You should see your bookings listed
3. ✅ Each booking should show:
   - Listing image and title
   - Check-in and check-out dates
   - Total price
   - Booking status
   - Booking ID

**What happens in the backend:**
- GET request to `/api/bookings/user/:userId`
- Bookings are fetched from MongoDB
- Listings are populated (joined)
- Sorted by creation date (newest first)
- Returned as JSON array

### Test 5: Add to Wishlist (if implemented in frontend)
1. Navigate to any listing
2. Click the heart icon to add to wishlist
3. ✅ Heart should fill in
4. Navigate to dashboard → Wishlist tab
5. ✅ Item should appear in wishlist

**What happens in the backend:**
- POST request to `/api/wishlist`
- Wishlist item is created
- Duplicate check (unique constraint)
- Saved to MongoDB
- Success response returned

## 🔍 Checking the Database

### Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `dreamroute`
4. Check collections:
   - `users` - Should have your registered users
   - `bookings` - Should have your test bookings
   - `listings` - Should have listings (from seed data)
   - `wishlists` - Should have wishlist items

### Using MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to dreamroute database
use dreamroute

# View all users
db.users.find().pretty()

# View all bookings
db.bookings.find().pretty()

# View bookings with populated listing data
db.bookings.aggregate([
  {
    $lookup: {
      from: "listings",
      localField: "listing",
      foreignField: "_id",
      as: "listingDetails"
    }
  }
])

# Count documents
db.users.countDocuments()
db.bookings.countDocuments()
db.listings.countDocuments()

# Find specific user by email
db.users.findOne({ email: "test@example.com" })

# Find bookings for a specific user
db.bookings.find({ user: ObjectId("USER_ID_HERE") })
```

## 🐛 Troubleshooting

### Issue: "User already exists" error
**Solution:** Use a different email address or delete the existing user from MongoDB

### Issue: "Listing not found" error
**Solution:** Make sure you have listings in the database. Run the seed script:
```bash
cd server
node seed.js
```

### Issue: "No token, authorization denied"
**Solution:** Make sure you're logged in and the token is in localStorage

### Issue: Booking creation fails
**Possible causes:**
1. No listings in database → Run seed script
2. Missing required fields → Check console for error details
3. Invalid dates → Make sure check-in is before check-out
4. Payment simulation failed (5% chance) → Try again

### Issue: Dashboard shows no bookings
**Possible causes:**
1. No bookings created yet → Create a test booking
2. Wrong user ID → Check localStorage user data
3. Backend not running → Start the server

## 📊 Expected Data Flow

### Registration → Login → Booking Flow

```
1. User Registration
   Frontend → POST /api/auth/signup → Backend
   Backend → Hash password → Save to MongoDB → Generate JWT
   Backend → Response with token and user data
   Frontend → Store in localStorage → Redirect to dashboard

2. User Login
   Frontend → POST /api/auth/signin → Backend
   Backend → Verify credentials → Generate JWT
   Backend → Response with token and user data
   Frontend → Store in localStorage → Redirect to dashboard

3. View Listings
   Frontend → GET /api/listings → Backend
   Backend → Fetch from MongoDB → Return listings
   Frontend → Display listings

4. Create Booking
   Frontend → POST /api/bookings/new → Backend
   Backend → Validate data → Check availability
   Backend → Simulate payment → Create booking
   Backend → Save to MongoDB → Return booking
   Frontend → Show success → Redirect to dashboard

5. View Bookings
   Frontend → GET /api/bookings/user/:userId → Backend
   Backend → Fetch bookings → Populate listing data
   Backend → Return bookings array
   Frontend → Display in dashboard
```

## ✅ Success Indicators

### Registration Success
- ✅ User redirected to dashboard
- ✅ User data in localStorage
- ✅ User document in MongoDB users collection
- ✅ Password is hashed (not plain text)

### Login Success
- ✅ User redirected to dashboard
- ✅ JWT token in localStorage
- ✅ User data in localStorage

### Booking Success
- ✅ Success message displayed
- ✅ Booking reference number shown
- ✅ Booking appears in dashboard
- ✅ Booking document in MongoDB bookings collection
- ✅ Booking has all required fields:
  - user (ObjectId)
  - listing (ObjectId)
  - checkIn (Date)
  - checkOut (Date)
  - guests (Object)
  - primaryGuest (Object)
  - totalPrice (Number)
  - paymentStatus: 'paid'
  - status: 'confirmed'
  - bookingReference (String)
  - paymentId (String)

## 🎨 Testing with Browser DevTools

### Check localStorage
```javascript
// Open browser console (F12)

// View stored user
console.log(JSON.parse(localStorage.getItem('user')))

// View stored token
console.log(localStorage.getItem('token'))

// Clear storage (logout)
localStorage.clear()
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions (register, login, book)
4. Check requests:
   - ✅ Status should be 200 or 201 for success
   - ✅ Response should contain expected data
   - ❌ 400/401/500 indicates an error

### Common Response Codes
- `200 OK` - Success (GET, PUT)
- `201 Created` - Success (POST - resource created)
- `400 Bad Request` - Invalid data sent
- `401 Unauthorized` - Not logged in or invalid token
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Backend error

## 🚀 Quick Test Checklist

- [ ] MongoDB is running
- [ ] Server is running on port 5000
- [ ] Client is running on port 5173
- [ ] Can access homepage
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Can view listings
- [ ] Can create booking
- [ ] Can view bookings in dashboard
- [ ] Booking data is in MongoDB
- [ ] User data is in MongoDB

## 📝 Sample Test Data

### User Registration
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Booking Data
```json
{
  "listingId": "675d1234567890abcdef1234",
  "userId": "675d1234567890abcdef5678",
  "checkIn": "2024-12-15",
  "checkOut": "2024-12-20",
  "guests": 2,
  "totalPrice": 500,
  "guestDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  },
  "paymentDetails": {
    "method": "credit_card",
    "cardNumber": "4111111111111111",
    "expiry": "12/25",
    "cvc": "123",
    "nameOnCard": "John Doe"
  }
}
```

---

**Need Help?**
- Check server console for error messages
- Check browser console for frontend errors
- Check MongoDB for data persistence
- Review BACKEND_INTEGRATION.md for API documentation
