import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    googleId: { type: String }, // Optional for email/password users
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google-only users
    name: { type: String, required: true },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    verificationOTPExpires: { type: Date },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
