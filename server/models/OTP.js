import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // 10 minutes - automatically deletes from DB
    }
});

export default mongoose.model('OTP', OTPSchema);
