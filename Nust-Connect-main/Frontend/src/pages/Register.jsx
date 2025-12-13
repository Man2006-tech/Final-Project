import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, User, Mail, Lock } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Call register API
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            console.log('Register response:', response);
            setSuccess('Registration successful! Please check your email to verify your account.');

            // Optional: Redirect after a delay
            setTimeout(() => {
                console.log('Navigating to login...');
                navigate('/login');
            }, 3000);

        } catch (err) {
            console.error('Registration error:', err);
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-primary-600/20 to-secondary-600/20 blur-3xl animate-float" />
                <div className="absolute bottom-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-purple-600/20 to-pink-600/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-br from-secondary-500 to-primary-600 p-4 rounded-2xl shadow-lg shadow-secondary-500/20 transform hover:scale-105 transition-transform duration-300">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-primary-400">NUST Connect</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Create your account and get started</p>
                </div>

                {/* Register Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm flex items-center animate-slide-up">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-4 text-sm flex items-center animate-slide-up">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        {/* Name Input */}
                        <div className="group">
                            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-secondary-400 transition-colors">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={18} className="text-slate-500 group-focus-within:text-secondary-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 transition-all duration-300 hover:bg-slate-900/70"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="group">
                            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-secondary-400 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-slate-500 group-focus-within:text-secondary-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="student@nust.edu.pk"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 transition-all duration-300 hover:bg-slate-900/70"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-secondary-400 transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-slate-500 group-focus-within:text-secondary-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                    className="w-full pl-11 pr-11 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 transition-all duration-300 hover:bg-slate-900/70"
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

                        {/* Confirm Password */}
                        <div className="group">
                            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-secondary-400 transition-colors">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-slate-500 group-focus-within:text-secondary-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 transition-all duration-300 hover:bg-slate-900/70"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="group">
                            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-secondary-400 transition-colors">
                                I am a
                            </label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 transition-all duration-300 hover:bg-slate-900/70 appearance-none cursor-pointer"
                                >
                                    <option value="STUDENT" className="bg-slate-900">Student</option>
                                    <option value="FACULTY" className="bg-slate-900">Faculty</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-500 hover:to-primary-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-secondary-600/20 transform hover:-translate-y-0.5 transition-all duration-300 mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-slate-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white hover:text-secondary-300 font-semibold transition-colors ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-slate-500 text-sm">
                    © 2024 NUST Connect. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Register;