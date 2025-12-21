import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, GraduationCap, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        }
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (!token) {
            setError('Invalid reset token');
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(token, formData.newPassword);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Reset password error:', err);
            setError(
                err.response?.data?.message ||
                'Failed to reset password. The link may have expired.'
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
                        Set New Password
                    </h1>
                    <p className="text-slate-400 text-lg">Create a strong password for your account</p>
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
                                {/* New Password Input */}
                                <div className="group">
                                    <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-primary-400 transition-colors">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            required
                                            className="w-full pl-11 pr-11 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 hover:bg-slate-900/70"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="group">
                                    <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-primary-400 transition-colors">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 hover:bg-slate-900/70"
                                        />
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-slate-800/50 rounded-xl p-3 text-xs text-slate-400">
                                    <p className="font-medium text-slate-300 mb-1">Password must:</p>
                                    <ul className="space-y-0.5 ml-4 list-disc">
                                        <li>Be at least 6 characters long</li>
                                        <li>Match in both fields</li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    loading={loading}
                                    disabled={!token}
                                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center relative z-10">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Password Reset Successful!</h3>
                            <p className="text-slate-300 text-sm mb-6">
                                Your password has been changed successfully.
                            </p>
                            <p className="text-slate-400 text-xs">
                                Redirecting to login page...
                            </p>
                        </div>
                    )}

                    {/* Back to Login */}
                    {!success && (
                        <div className="mt-6 pt-6 border-t border-white/10 text-center relative z-10">
                            <Link
                                to="/login"
                                className="inline-flex items-center text-slate-400 hover:text-white text-sm transition-colors cursor-pointer"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-slate-500 text-sm">
                    © 2024 NUST Connect. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
