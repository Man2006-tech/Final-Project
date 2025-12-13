import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Car,
    Calendar,
    ShoppingBag,
    Search,
    Briefcase,
    MessageSquare,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRecent, addToRecent, getTimeSince } from '../utils/recentlyAccessed';
import Card from '../components/common/Card';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentModules, setRecentModules] = useState([]);

    useEffect(() => {
        // Load recently accessed modules
        setRecentModules(getRecent());
    }, []);

    const allModules = [
        {
            name: 'Ride Sharing',
            icon: Car,
            path: '/rides',
            description: 'Share rides with fellow students',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            name: 'Events',
            icon: Calendar,
            path: '/events',
            description: 'Discover and register for campus events',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            name: 'Marketplace',
            icon: ShoppingBag,
            path: '/marketplace',
            description: 'Buy and sell items with students',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            name: 'Lost & Found',
            icon: Search,
            path: '/lost-found',
            description: 'Report and find lost items',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            name: 'Jobs',
            icon: Briefcase,
            path: '/jobs',
            description: 'Browse job and internship opportunities',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            name: 'Complaints',
            icon: MessageSquare,
            path: '/complaints',
            description: 'Submit grievances and feedback',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    const handleModuleClick = (module) => {
        // Add to recently accessed
        addToRecent(module.name, module.path, module.icon.name);
        setRecentModules(getRecent());

        // Navigate to module
        navigate(module.path);
    };

    const currentHour = new Date().getHours();
    const greeting =
        currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-blue-900 shadow-2xl">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner border border-white/20">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-secondary-300">{user?.name || 'User'}</span>!
                        </h1>
                        <p className="text-blue-100 text-lg opacity-90">Welcome to your NUST Connect dashboard.</p>
                    </div>
                    <div className="hidden md:block text-right bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <p className="text-sm text-blue-100 font-medium">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                        <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-200 border border-primary-500/30">
                            {user?.role || 'Student'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden relative group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <Car size={24} />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Active Rides</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                    </div>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden relative group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                <Calendar size={24} />
                            </div>
                            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Upcoming</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Events</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
                    </div>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden relative group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">New</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Marketplace</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">25</p>
                    </div>
                </Card>
            </div>

            {/* Recently Accessed Section */}
            {recentModules.length > 0 && (
                <div className="animate-slide-up">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Clock className="text-slate-700" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Recently Accessed</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentModules.map((module, index) => {
                            const moduleInfo = allModules.find((m) => m.path === module.path);
                            if (!moduleInfo) return null;

                            const IconComponent = moduleInfo.icon;

                            return (
                                <Card
                                    key={index}
                                    hoverable
                                    onClick={() => navigate(module.path)}
                                    className="cursor-pointer border-none shadow-md hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl ${moduleInfo.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className={moduleInfo.color} size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                                                {module.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {getTimeSince(module.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* All Modules Grid */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <span className="w-1 h-6 bg-primary-500 rounded-full mr-3"></span>
                    All Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allModules.map((module, index) => {
                        const IconComponent = module.icon;

                        return (
                            <Card
                                key={index}
                                hoverable
                                onClick={() => handleModuleClick(module)}
                                className="cursor-pointer border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`w-16 h-16 rounded-2xl ${module.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className={module.color} size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {module.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{module.description}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;