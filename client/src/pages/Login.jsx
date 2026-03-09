import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const { loginWithGoogle, isAuthenticated, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSimulatedLogin = async () => {
        // For development convenience without full OAuth setup, we'll simulate a login payload
        // In production, use @react-oauth/google or similar Google Identity Services
        try {
            // Simulate OAuth token acquisition (Requires backend bypass or valid token in real usage)
            // Here we just use a placeholder to trigger the store's login flow which would hit our real endpoint
            // To truly bypass for local dev, you might alter authController, but we'll leave actual logic
            // In practice: wait api.post('/auth/google', { token: realGoogleToken })
            alert("Note: Google OAuth requires valid Credentials configuration. To test locally without it, please disable the Google token verification in the authController or supply a real token.");
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex text-gray-900 bg-gray-50">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-28">
                <div className="mb-10 flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-lg">AI</div>
                    <span className="text-2xl font-bold tracking-tight">ResumeBuilder</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight mb-3">Create a winning resume in minutes.</h1>
                <p className="text-gray-500 text-lg mb-10">Use AI to generate, score, and perfect your ATS-friendly resume.</p>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">{error}</div>}

                <button
                    onClick={handleSimulatedLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-gray-700 py-3.5 rounded-xl font-semibold text-lg"
                >
                    <FcGoogle className="text-2xl" />
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                </button>
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
