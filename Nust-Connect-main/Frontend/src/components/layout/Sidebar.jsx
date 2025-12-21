import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    Calendar,
    ShoppingBag,
    Search,
    Briefcase,
    MessageSquare,
    Menu,
    X,
    User,
    Users,
    Shield,
    Camera,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();

    const baseNavItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Social Feed', icon: Camera, path: '/feed', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Profile', icon: User, path: '/profile', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Admin Panel', icon: Shield, path: '/admin', roles: ['ADMIN', 'FACULTY'] },
        { name: 'Ride Sharing', icon: Car, path: '/rides', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Events', icon: Calendar, path: '/events', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Marketplace', icon: ShoppingBag, path: '/marketplace', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Lost & Found', icon: Search, path: '/lost-found', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Jobs', icon: Briefcase, path: '/jobs', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Clubs', icon: Users, path: '/clubs', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
        { name: 'Complaints', icon: MessageSquare, path: '/complaints', roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
    ];

    // Filter nav items based on user role
    const navItems = baseNavItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg"
            >
                {isCollapsed ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'
                    }`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <LayoutDashboard size={24} />
                        </div>
                        {!isCollapsed && (
                            <h1 className="text-xl font-bold">NUST Connect</h1>
                        )}
                    </div>
                </div>

                {/* User Role Badge */}
                {!isCollapsed && (
                    <div className="px-4 py-3 bg-slate-800/50">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${user?.role === 'ADMIN' ? 'bg-red-500/20 text-red-300' :
                                    user?.role === 'FACULTY' ? 'bg-purple-500/20 text-purple-300' :
                                        'bg-blue-500/20 text-blue-300'
                                    }`}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                } ${item.name === 'Admin Panel' ? 'border border-red-500/30' : ''}`
                            }
                        >
                            <item.icon size={22} />
                            {!isCollapsed && <span className="font-medium">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse Toggle (Desktop) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute bottom-6 right-4 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    <Menu size={20} />
                </button>
            </aside>

            {/* Overlay for mobile */}
            {!isCollapsed && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </>
    );
};

export default Sidebar;