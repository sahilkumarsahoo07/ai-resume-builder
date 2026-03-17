import express from 'express';
import { 
    googleLogin, 
    register, 
    login, 
    verifyOTP, 
    resendOTP, 
    forgotPassword, 
    resetPassword,
    sendRegisterOTP
} from '../controllers/authController.js';

const router = express.Router();

router.post('/google', googleLogin);
router.post('/send-register-otp', sendRegisterOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
