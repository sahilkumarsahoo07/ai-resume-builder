import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const { 
        loginWithGoogle, 
        login, 
        signup, 
        sendRegisterOTP,
        verifyOTP, 
        resendOTP, 
        forgotPassword, 
        resetPassword, 
        isAuthenticated, 
        isLoading 
    } = useAuthStore();
    const navigate = useNavigate();
    
    // View States
    const [view, setView] = useState('login'); // login, signup, otp, forgot, reset
    
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        otp: '',
        newPassword: ''
    });
    const [tempUserId, setTempUserId] = useState(null);
    const [isSignupOTP, setIsSignupOTP] = useState(false);
    
    // Resend Rate Limiting
    const [resendCount, setResendCount] = useState(0);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (view === 'login') {
            const result = await login(formData.email, formData.password);
            if (!result.success) {
                if (result.message.includes('not verified')) {
                    setTempUserId(result.userId);
                    setIsSignupOTP(false);
                    setView('otp');
                } else {
                    setError(result.message);
                }
            }
        } else if (view === 'signup') {
            // --- TEMPORARILY DISABLED OTP UI ---
            // const result = await sendRegisterOTP(formData.email);
            // if (result.success) {
            //     setIsSignupOTP(true);
            //     setView('otp');
            //     setMessage('Verification code sent to your email.');
            // } else {
            //     setError(result.message);
            // }
            
            // Bypass straight to signup
            const result = await signup(formData.name, formData.email, formData.password, '123456');
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
            // -----------------------------------
        } else if (view === 'otp') {
            if (isSignupOTP) {
                // Finalize signup with OTP
                const result = await signup(formData.name, formData.email, formData.password, formData.otp);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.message);
                }
            } else {
                // Existing user verification
                const result = await verifyOTP(tempUserId, formData.otp);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.message);
                }
            }
        } else if (view === 'forgot') {
            const result = await forgotPassword(formData.email);
            if (result.success) {
                setView('reset');
                setMessage('Reset code sent to your email.');
            } else {
                setError(result.message);
            }
        } else if (view === 'reset') {
            const result = await resetPassword(formData.email, formData.otp, formData.newPassword);
            if (result.success) {
                setView('login');
                setMessage('Password reset successfully. You can now login.');
            } else {
                setError(result.message);
            }
        }
    };

    const handleGoogleSuccess = async (response) => {
        const result = await loginWithGoogle(response.credential);
        if (!result.success) {
            setError(result.message);
        }
    };

    const toggleView = (newView) => {
        setView(newView);
        setError('');
        setMessage('');
    };

    const handleResendOTP = async () => {
        if (cooldown > 0) return;

        const result = await resendOTP(tempUserId, isSignupOTP ? formData.email : null);
        if (result.success) {
            setMessage('A new code has been sent.');
            const newCount = resendCount + 1;
            setResendCount(newCount);
            
            // If used 3 times before (this is the 4th click or more), wait 5 mins
            if (newCount >= 3) {
                setCooldown(300); // 5 minutes
            } else {
                setCooldown(60); // 1 minute
            }
        } else {
            setError(result.message);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex text-gray-900 bg-gray-50">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-28 py-12">
                <div className="mb-10 flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-lg">AI</div>
                    <span className="text-2xl font-bold tracking-tight">ResumeBuilder</span>
                </div>

                <div className="max-w-md w-full animate-fadeIn">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">
                        {view === 'login' && 'Welcome back'}
                        {view === 'signup' && 'Create an account'}
                        {view === 'otp' && 'Verify Email'}
                        {view === 'forgot' && 'Forgot Password?'}
                        {view === 'reset' && 'Reset Password'}
                    </h1>
                    <p className="text-gray-500 text-lg mb-8">
                        {view === 'login' && 'Sign in to access your resumes and AI tools.'}
                        {view === 'signup' && 'Join thousands of job seekers using AI to land their dream job.'}
                        {view === 'otp' && `We've sent a 6-digit code to ${formData.email}`}
                        {view === 'forgot' && 'Enter your email and we will send you a reset code.'}
                        {view === 'reset' && 'Enter the reset code sent to your email and your new password.'}
                    </p>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 border border-red-100">{error}</div>}
                    {message && <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 border border-green-100"><FiCheckCircle /> {message}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        {view === 'signup' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        )}
                        
                        {(view === 'login' || view === 'signup' || view === 'forgot' || view === 'reset') && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        disabled={view === 'reset'}
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>
                        )}

                        {(view === 'login' || view === 'signup') && (
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                                    {view === 'login' && (
                                        <button type="button" onClick={() => toggleView('forgot')} className="text-xs font-bold text-primary-600 hover:underline">Forgot password?</button>
                                    )}
                                </div>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        )}

                        {(view === 'otp' || view === 'reset') && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{view === 'reset' ? 'Reset Code' : '6-Digit Code'}</label>
                                <input
                                    type="text"
                                    name="otp"
                                    required
                                    maxLength="6"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    placeholder="000000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-center text-2xl font-black tracking-widest placeholder:text-gray-300"
                                />
                                {view === 'otp' && (
                                    <div className="mt-2 flex items-center justify-between">
                                        <button 
                                            type="button" 
                                            onClick={handleResendOTP} 
                                            disabled={cooldown > 0}
                                            className="text-xs font-bold text-primary-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                                        >
                                            Didn't receive a code? {cooldown > 0 ? `Resend in ${formatTime(cooldown)}` : 'Resend'}
                                        </button>
                                        {resendCount > 0 && cooldown === 0 && (
                                            <span className="text-[10px] font-medium text-gray-400">({3 - resendCount} attempts left for 1m wait)</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {view === 'reset' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        required
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center disabled:opacity-70 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {view === 'login' && 'Sign In'}
                                    {view === 'signup' && 'Create Account'}
                                    {view === 'otp' && 'Verify Account'}
                                    {view === 'forgot' && 'Send Reset Code'}
                                    {view === 'reset' && 'Reset Password'}
                                </span>
                            )}
                        </button>
                    </form>

                    {(view === 'login' || view === 'signup') && (
                        <>
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-50 text-gray-400 font-medium">Or continue with</span></div>
                            </div>

                            <div className="w-full flex flex-col items-center mb-8">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google Login Failed')}
                                    useOneTap
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    text={view === 'signup' ? 'signup_with' : 'signin_with'}
                                    shape="pill"
                                />
                            </div>
                        </>
                    )}

                    <p className="text-center text-gray-500 font-medium">
                        {(view === 'login' || view === 'forgot') && (
                            <>Don't have an account? <button onClick={() => toggleView('signup')} className="text-primary-600 font-bold hover:underline">Sign Up</button></>
                        )}
                        {(view === 'signup' || view === 'otp' || view === 'reset') && (
                            <>Already have an account? <button onClick={() => toggleView('login')} className="text-primary-600 font-bold hover:underline">Sign In</button></>
                        )}
                        {view === 'forgot' && (
                             <div className="mt-4">
                                <button onClick={() => toggleView('login')} className="flex items-center gap-1 mx-auto text-sm text-gray-500 hover:text-primary-600 transition-colors">
                                    <FiArrowLeft /> Back to Login
                                </button>
                             </div>
                        )}
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-indigo-800 p-12 relative overflow-hidden flex-col justify-center">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3 blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400 opacity-20 rounded-full transform -translate-x-1/3 translate-y-1/3 blur-3xl mix-blend-overlay"></div>

                <div className="relative z-10 text-white max-w-xl">
                    <h2 className="text-4xl font-bold mb-6">Built for the Modern Job Seeker.</h2>
                    <ul className="space-y-5 text-xl text-primary-50">
                        <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white opacity-50"></span> Smart Job Matching</li>
                        <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white opacity-50"></span> Instant ATS Scoring</li>
                        <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white opacity-50"></span> Professional Templates</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;
