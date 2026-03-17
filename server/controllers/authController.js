import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import sendEmail from '../utils/sendEmail.js';
import { getOTPTemplate, getWelcomeTemplate } from '../utils/emailTemplates.js';
import crypto from 'crypto';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

const generateToken = (id) => {
    return jwt.sign(
        { userId: id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
    );
};

// Helper: Generate 6 digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendRegisterOTP = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`[OTP] Request for: ${email}`);

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const otp = generateOTP();
        console.log(`[OTP] Generated code for: ${email}`);
        
        // Save OTP to temporary collection (upsert if exists)
        await OTP.findOneAndUpdate(
            { email },
            { otp },
            { upsert: true, new: true }
        );
        console.log(`[OTP] Stored in DB for: ${email}`);

        // Send Email
        try {
            await sendEmail({
                email,
                subject: 'Verify your AI Resume Builder account',
                message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
                html: getOTPTemplate(otp, 'verification')
            });
            console.log(`[OTP] Email sent to: ${email}`);
            
            res.status(200).json({ success: true, message: 'Verification code sent to email' });
        } catch (emailErr) {
            console.error('[OTP] Email delivery failed:', emailErr.message);
            res.status(500).json({ success: false, message: `Email delivery failed: ${emailErr.message}` });
        }
    } catch (error) {
        console.error('[OTP] General error:', error.message);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        // 1. Verify OTP first
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // 2. Check if user exists (last second check)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 3. Create User
        const user = await User.create({
            name,
            email,
            password,
            isVerified: true // Verified because OTP was correct
        });

        // 4. Delete OTP record
        await OTP.deleteOne({ email });

        // 5. Send Welcome Email (Non-blocking)
        sendEmail({
            email: user.email,
            subject: 'Welcome to AI Resume Builder! 🚀',
            message: `Hi ${user.name}, welcome to AI Resume Builder!`,
            html: getWelcomeTemplate(user.name)
        }).catch(err => console.error('Welcome email failed:', err));

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        if (user.verificationOTP !== otp || user.verificationOTPExpires < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account verified successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { userId, email } = req.body;

        // Flow 1: New User (Pre-registration)
        if (email && !userId) {
            const otp = generateOTP();
            await OTP.findOneAndUpdate({ email }, { otp }, { upsert: true });
            
            await sendEmail({
                email,
                subject: 'New Verification Code',
                message: `Your new verification code is: ${otp}`,
                html: getOTPTemplate(otp, 'verification')
            });
            return res.status(200).json({ success: true, message: 'Verification code resent' });
        }

        // Flow 2: Existing User (Post-registration)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.verificationOTP = otp;
        user.verificationOTPExpires = otpExpires;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'New Verification Code',
            message: `Your new verification code is: ${otp}`,
            html: `<p>Your new verification code is: <strong>${otp}</strong></p>`
        });

        res.status(200).json({ success: true, message: 'Verification code resent' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Account not verified. Please verify your email.',
                    isNotVerified: true,
                    userId: user._id
                });
            }

            res.json({
                success: true,
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with this email' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = otpExpires;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message: `Your password reset code is: ${otp}. It expires in 10 minutes.`,
            html: getOTPTemplate(otp, 'reset')
        });

        res.status(200).json({ success: true, message: 'Reset OTP sent to email' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture: avatar } = payload;

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            user = await User.create({
                googleId,
                email,
                name,
                avatar,
                isVerified: true // Google users are already verified
            });

            // Send Welcome Email for new Google user (Non-blocking)
            sendEmail({
                email: user.email,
                subject: 'Welcome to AI Resume Builder! 🚀',
                message: `Hi ${user.name}, welcome to AI Resume Builder!`,
                html: getWelcomeTemplate(user.name)
            }).catch(err => console.error('Welcome email failed:', err));
        } else {
            // Update existing user
            let changed = false;
            if (!user.googleId) {
                user.googleId = googleId;
                changed = true;
            }
            if (!user.isVerified) {
                user.isVerified = true;
                changed = true;
            }
            if (!user.avatar && avatar) {
                user.avatar = avatar;
                changed = true;
            }
            if (changed) await user.save();
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
