import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, GraduationCap } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authAPI.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(
                err.response?.data?.message ||
                'Failed to send reset email. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-600/20 to-secondary-600/20 blur-3xl animate-float" />
                <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-blue-600/20 to-purple-600/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-br from-primary-500 to-secondary-600 p-4 rounded-2xl shadow-lg shadow-primary-500/20 transform hover:scale-105 transition-transform duration-300">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-slate-400 text-lg">We'll send you a reset link</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {!success ? (
                        <>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm flex items-center animate-slide-up">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <p className="text-slate-300 text-sm mb-6">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>

                                {/* Email Input */}
                                <div className="group">
                                    <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-primary-400 transition-colors">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@nust.edu.pk"
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 hover:bg-slate-900/70"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    loading={loading}
                                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center relative z-10">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
                            <p className="text-slate-300 text-sm mb-6">
                                We've sent a password reset link to <span className="font-semibold text-white">{email}</span>
                            </p>
                            <p className="text-slate-400 text-xs">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center relative z-10">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-slate-400 hover:text-white text-sm transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-slate-500 text-sm">
                    © 2024 NUST Connect. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
