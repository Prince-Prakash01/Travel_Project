const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/emailService');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.signup = async (req, res) => {
    try {
        console.log('📝 Registration attempt:', { name: req.body.name, email: req.body.email });

        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with isVerified = false (requires admin approval)
        const result = await User.create({
            email,
            password: hashedPassword,
            name,
            isVerified: false  // User must be approved by admin before they can login
        });

        console.log('✅ User created successfully (pending admin approval):', { id: result._id, email: result.email, name: result.name });

        // Don't generate token - user needs admin approval first
        res.status(201).json({
            message: 'Registration successful! Your account is pending admin approval. You will be able to login once approved.',
            result: { name: result.name, email: result.email }
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        console.log('🔐 Login attempt:', { email: req.body.email });

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        console.log('👤 User found:', existingUser ? 'Yes' : 'No');

        if (!existingUser) {
            console.log('❌ User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is verified (approved by admin)
        if (!existingUser.isVerified) {
            console.log('❌ User not verified:', email);
            return res.status(403).json({ message: 'Your account is pending admin approval. Please wait for approval before logging in.' });
        }

        console.log('🔑 Comparing passwords...');
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        console.log('✅ Password match:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log('❌ Invalid password for:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('✅ Login successful for:', email);

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        console.error('❌ Signin error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Set OTP expiry to 10 minutes from now
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP to user document
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = otpExpiry;
        await user.save();

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp, user.name);
            res.status(200).json({
                message: 'OTP sent successfully to your email',
                email: email
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            res.status(500).json({
                message: 'Failed to send OTP email. Please check email configuration.'
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Reset Password - Verify OTP and Update Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP exists
        if (!user.resetPasswordOTP) {
            return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
        }

        // Check if OTP has expired
        if (user.resetPasswordOTPExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -resetPasswordOTP -resetPasswordOTPExpires');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, dateOfBirth, gender, address, passport, preferences } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (gender) updateData.gender = gender;
        if (address) updateData.address = address;
        if (passport) updateData.passport = passport;
        if (preferences) updateData.preferences = preferences;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordOTP -resetPasswordOTPExpires');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
