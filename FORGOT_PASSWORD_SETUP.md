# Forgot Password Feature - Email Setup Guide

## Overview
The forgot password feature has been successfully implemented! Users can now reset their password by receiving a 6-digit OTP via email.

## How It Works
1. User clicks "Forgot Password?" on the login page
2. User enters their email address
3. System generates a 6-digit OTP and sends it to the user's email
4. OTP is valid for 10 minutes
5. User enters the OTP and sets a new password
6. User can now login with the new password

## Email Configuration Required

To enable email sending, you need to configure Gmail SMTP in your `.env` file:

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device and name it "DreamRoute"
4. Click "Generate"
5. Copy the 16-character password (remove spaces)

### Step 3: Update .env File
Open `server/.env` and update these values:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Example:**
```env
EMAIL_USER=johndoe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Restart the Server
After updating the `.env` file, restart your server:
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Testing the Feature

1. Navigate to http://localhost:5173/login
2. Click "Forgot Password?"
3. Enter a registered email address
4. Check your email for the OTP (check spam folder if not in inbox)
5. Enter the OTP and set a new password
6. Login with your new password

## Alternative Email Services

If you prefer not to use Gmail, you can modify `server/utils/emailService.js` to use other services:

### Using Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

### Using Custom SMTP
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.your-email-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

## Troubleshooting

### Email Not Sending
- Check that EMAIL_USER and EMAIL_PASSWORD are correctly set in `.env`
- Verify 2-factor authentication is enabled on Gmail
- Ensure you're using an App Password, not your regular Gmail password
- Check server console for error messages

### OTP Expired
- OTPs expire after 10 minutes
- Request a new OTP if yours has expired

### User Not Found
- Ensure the email address is registered in the system
- Check for typos in the email address

## Security Features

✅ OTP expires after 10 minutes
✅ OTP is stored hashed in the database
✅ Password is hashed using bcrypt
✅ OTP is cleared from database after successful password reset
✅ Email validation on both frontend and backend

## API Endpoints

### POST /api/auth/forgot-password
Request OTP for password reset
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password
Reset password with OTP
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

## Files Modified/Created

### Backend
- ✅ `server/models/User.js` - Added OTP fields
- ✅ `server/controllers/authController.js` - Added forgot/reset password logic
- ✅ `server/routes/authRoutes.js` - Added new routes
- ✅ `server/utils/emailService.js` - Email sending utility (NEW)
- ✅ `server/.env` - Email configuration

### Frontend
- ✅ `client/src/pages/ForgotPassword.jsx` - Forgot password page (NEW)
- ✅ `client/src/pages/Login.jsx` - Added forgot password link
- ✅ `client/src/App.jsx` - Added forgot password route

## Next Steps

1. Configure your Gmail credentials in `.env`
2. Restart the server
3. Test the forgot password flow
4. Consider customizing the email template in `server/utils/emailService.js`

Enjoy your new password reset feature! 🎉
