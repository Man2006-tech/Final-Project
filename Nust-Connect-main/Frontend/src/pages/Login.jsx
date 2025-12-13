import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'STUDENT',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email, role: formData.role });
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login response received:', response.data);
      const { token, userId, name, email, role } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store user data and token
      login(
        { userId, name, email, role },
        token
      );

      console.log('Login successful, navigating to dashboard...');
      // Navigation handled by useEffect watching isAuthenticated

    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-600/20 to-secondary-600/20 blur-3xl animate-float" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-blue-600/20 to-purple-600/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[40%] left-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-600 p-4 rounded-2xl shadow-lg shadow-primary-500/20 transform hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            NUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Connect</span>
          </h1>
          <p className="text-slate-400 text-lg">Your Campus, Connected.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <h2 className="text-2xl font-semibold text-white mb-6 relative z-10">Welcome Back</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center animate-slide-up">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email Input */}
            <div className="group">
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-primary-400 transition-colors">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@nust.edu.pk"
                required
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 hover:bg-slate-900/70"
              />
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-primary-400 transition-colors">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 hover:bg-slate-900/70"
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

            {/* Role Selection */}
            <div className="group">
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1 group-focus-within:text-primary-400 transition-colors">
                Login As
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 hover:bg-slate-900/70 appearance-none cursor-pointer"
                >
                  <option value="STUDENT" className="bg-slate-900">Student</option>
                  <option value="FACULTY" className="bg-slate-900">Faculty</option>
                  <option value="ADMIN" className="bg-slate-900">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                <input
                  type="checkbox"
                  className="mr-2.5 w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-primary-600 focus:ring-offset-0 focus:ring-2 focus:ring-primary-500/50"
                />
                Remember me
              </label>
              <a href="#" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center relative z-10">
            <p className="text-slate-400 text-sm mb-3">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-block px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300 border border-white/10 hover:border-primary-500/50"
            >
              Create New Account
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

export default Login;