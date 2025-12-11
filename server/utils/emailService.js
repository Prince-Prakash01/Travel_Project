const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send OTP email
exports.sendOTPEmail = async (email, otp, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"DreamRoute" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP - DreamRoute',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: white;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .otp-box {
                            background: #f0f0f0;
                            border: 2px dashed #667eea;
                            padding: 20px;
                            text-align: center;
                            margin: 20px 0;
                            border-radius: 8px;
                        }
                        .otp-code {
                            font-size: 32px;
                            font-weight: bold;
                            color: #667eea;
                            letter-spacing: 5px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                        .warning {
                            color: #e74c3c;
                            font-size: 14px;
                            margin-top: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${userName}</strong>,</p>
                            <p>We received a request to reset your password for your DreamRoute account.</p>
                            <p>Your One-Time Password (OTP) is:</p>
                            
                            <div class="otp-box">
                                <div class="otp-code">${otp}</div>
                            </div>
                            
                            <p><strong>This OTP will expire in 10 minutes.</strong></p>
                            
                            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                            
                            <p class="warning">⚠️ Never share this OTP with anyone. DreamRoute will never ask for your OTP.</p>
                            
                            <p>Best regards,<br>The DreamRoute Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message, please do not reply to this email.</p>
                            <p>&copy; ${new Date().getFullYear()} DreamRoute. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent: ' + info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};
