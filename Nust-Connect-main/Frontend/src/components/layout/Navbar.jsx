import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bell,
    HelpCircle,
    ChevronDown,
    User,
    LogOut,
    MessageCircle,
    ExternalLink,
    LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../services/api';

import HelpModal from './HelpModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUsefulLinks, setShowUsefulLinks] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const notifRef = useRef(null);
    const linksRef = useRef(null);
    const userRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (linksRef.current && !linksRef.current.contains(event.target)) {
                setShowUsefulLinks(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNotificationClick = (link) => {
        setShowNotifications(false);
        navigate(link);
    };

    const usefulLinks = [
        { name: 'Student Clubs', url: '/clubs' },
        { name: 'Library Portal', url: '#' },
        { name: 'Academic Calendar', url: '#' },
        { name: 'Course Registration', url: '#' },
        { name: 'Fee Portal', url: '#' },
    ];

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch Notifications
    useEffect(() => {
        if (!user?.userId) return;

        const fetchNotifications = async () => {
            try {
                // Assuming api.js has getNotifications(userId)
                // We need to import notificationAPI first. 
                // Wait, I can't auto-import. I need to add import line separately or assume it's added.
                // I will add import in a separate step or let the user do it? No, I must do it.
                // I'll assume I can edit the whole file or multiple chunks.
                // Since I can only do ONE contiguous edit, I will replace the component logic here
                // and then add the import in another step? Or just use this step to do the logic
                // and hope I can add import later?
                // Actually, I can use multi_replace for this. But I selected replace_file_content.
                // I should probably cancel and use multi_replace?
                // No, I can just do the logic here and add import at the top in next step.

                const response = await notificationAPI.getNotifications(user.userId);
                // Filter out irrelevant ones if API returns everything (user said "which come to me")
                // Typically backend handles this /notifications/user/{id}
                const data = response.data || [];
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();
        // Poll every minute? Or just once on mount/user change
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user?.userId]);

    return (
        <>
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            <nav className="bg-white shadow-md sticky top-0 z-30 border-b border-gray-200">
                <div className="px-4 lg:px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left: Logo */}
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className="text-xl font-bold text-slate-900">
                                NUST Connect
                            </Link>
                        </div>

                        {/* Right: Useful Links, Notifications, Help, User Profile */}
                        <div className="flex items-center space-x-4">
                            {/* Useful Links Dropdown */}
                            <div className="relative" ref={linksRef}>
                                <button
                                    onClick={() => setShowUsefulLinks(!showUsefulLinks)}
                                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <span className="hidden md:inline text-sm font-medium">Useful Links</span>
                                    <ChevronDown size={16} />
                                </button>

                                {showUsefulLinks && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                        {usefulLinks.map((link, index) => (
                                            link.url.startsWith('/') ? (
                                                <Link
                                                    key={index}
                                                    to={link.url}
                                                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setShowUsefulLinks(false)}
                                                >
                                                    {link.name}
                                                    <ExternalLink size={14} />
                                                </Link>
                                            ) : (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {link.name}
                                                    <ExternalLink size={14} />
                                                </a>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Notifications */}
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.notificationId}
                                                        onClick={() => handleNotificationClick('/dashboard')} // Link logic depends on notif type
                                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${!notif.isRead ? 'bg-blue-50' : ''}`}
                                                    >
                                                        <p className="text-sm text-gray-900 font-medium">{notif.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="px-4 py-2 text-center border-t border-gray-200">
                                            <button className="text-sm text-blue-600 hover:text-blue-700">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Help Icon */}
                            <button
                                onClick={() => setShowHelp(true)}
                                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <HelpCircle size={20} />
                            </button>

                            {/* User Profile */}
                            <div className="relative" ref={userRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-semibold">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                                        {user?.name || 'User'}
                                    </span>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>

                                        <Link
                                            to="/dashboard"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </Link>

                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <User size={16} />
                                            <span>Profile</span>
                                        </Link>

                                        <Link
                                            to="/messages"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <MessageCircle size={16} />
                                            <span>Messages</span>
                                        </Link>

                                        <div className="border-t border-gray-200 my-2"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;