import { useState, useEffect } from 'react';
import { userAPI, eventAPI, venueBookingAPI } from '../services/api';
import { Users, FileText, Calendar, Trash2, Shield, Search, CheckCircle, Clock, MapPin, Building } from 'lucide-react';
import Button from '../components/common/Button';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'events') {
            fetchPendingEvents();
        } else if (activeTab === 'bookings') {
            fetchPendingBookings();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingEvents = async () => {
        setLoading(true);
        try {
            const response = await eventAPI.getPendingEvents();
            setPendingEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch pending events', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingBookings = async () => {
        setLoading(true);
        try {
            const response = await venueBookingAPI.getPendingBookings();
            setPendingBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch pending bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveEvent = async (eventId) => {
        if (!window.confirm("Approve this event?")) return;
        setActionLoading(eventId);
        try {
            await eventAPI.approveEvent(eventId);
            setPendingEvents(prev => prev.filter(e => e.eventId !== eventId));
        } catch (error) {
            console.error("Failed to approve event", error);
            alert("Failed to approve event");
        } finally {
            setActionLoading(null);
        }
    };

    const handleApproveBooking = async (bookingId) => {
        if (!window.confirm("Approve this booking?")) return;
        setActionLoading(bookingId);
        try {
            await venueBookingAPI.approveBooking(bookingId);
            setPendingBookings(prev => prev.filter(b => b.bookingId !== bookingId));
        } catch (error) {
            console.error("Failed to approve booking", error);
            alert("Failed to approve booking");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Reject/Cancel this booking?")) return;
        setActionLoading(bookingId);
        try {
            await venueBookingAPI.cancelBooking(bookingId);
            setPendingBookings(prev => prev.filter(b => b.bookingId !== bookingId));
        } catch (error) {
            console.error("Failed to cancel booking", error);
            alert("Failed to cancel booking");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? Action cannot be undone.')) {
            try {
                // await userAPI.deleteUser(userId); // Assuming delete endpoint exists
                console.log('Deleting user', userId);
                alert('Delete functionality would go here.');
            } catch (error) {
                console.error('Failed to delete user', error);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'posts', label: 'Posts & Content', icon: FileText },
        { id: 'events', label: 'Events Approval', icon: Calendar },
        { id: 'bookings', label: 'Venue Bookings', icon: Building },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
                <Shield className="mr-3 text-red-500" size={32} /> Admin & Faculty Panel
            </h1>

            {/* Tabs */}
            <div className="flex space-x-2 bg-slate-800/50 p-2 rounded-xl backdrop-blur-md overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} className="mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl min-h-[500px]">

                {/* User Management */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Registered Users</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:border-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center text-slate-400 py-10">Loading users...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-slate-400 text-sm border-b border-slate-700">
                                        <tr>
                                            <th className="pb-3 pl-4">Name</th>
                                            <th className="pb-3">Email</th>
                                            <th className="pb-3">Role</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3 text-right pr-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300">
                                        {filteredUsers.map(user => (
                                            <tr key={user.userId} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                                                <td className="py-3 pl-4 font-medium text-white">{user.name}</td>
                                                <td className="py-3">{user.email}</td>
                                                <td className="py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                                        user.role === 'FACULTY' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                                                            'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right pr-4">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.userId)}
                                                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {activeTab === 'posts' && (
                    <div className="text-center py-20 text-slate-400">
                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-white">Post Management</h3>
                        <p>Moderation tools for user posts will appear here.</p>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Pending Event Approvals</h2>
                        {loading ? (
                            <div className="text-center text-slate-400 py-10">Loading pending events...</div>
                        ) : pendingEvents.length === 0 ? (
                            <div className="text-center py-20 text-slate-400 bg-white/5 rounded-xl">
                                <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-green-500" />
                                <h3 className="text-xl font-medium text-white">All Caught Up!</h3>
                                <p>No pending event requests.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {pendingEvents.map(event => (
                                    <div key={event.eventId} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    {event.club?.name || 'General'}
                                                </span>
                                                <span className="text-slate-400 text-xs flex items-center">
                                                    <Clock size={12} className="mr-1" />
                                                    {new Date(event.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                                            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{event.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                                <div className="flex items-center">
                                                    <Calendar size={14} className="mr-1 text-purple-400" />
                                                    {new Date(event.startTime).toLocaleString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin size={14} className="mr-1 text-purple-400" />
                                                    {event.venueName || 'To be announced'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                onClick={() => handleApproveEvent(event.eventId)}
                                                disabled={actionLoading === event.eventId}
                                                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                                            >
                                                {actionLoading === event.eventId ? 'Approving...' : 'Approve Event'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Venue Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Pending Venue Bookings</h2>
                        {loading ? (
                            <div className="text-center text-slate-400 py-10">Loading pending bookings...</div>
                        ) : pendingBookings.length === 0 ? (
                            <div className="text-center py-20 text-slate-400 bg-white/5 rounded-xl">
                                <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-green-500" />
                                <h3 className="text-xl font-medium text-white">No Pending Bookings</h3>
                                <p>All venue requests have been processed.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {pendingBookings.map(booking => (
                                    <div key={booking.bookingId} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                    {booking.venue?.name || 'Venue'}
                                                </span>
                                                <span className="text-slate-400 text-xs flex items-center">
                                                    <Clock size={12} className="mr-1" />
                                                    {new Date(booking.bookingTime).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">{booking.purpose || 'Event Booking'}</h3>
                                            <p className="text-slate-400 text-sm mb-3">Requested by: {booking.user?.name}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                                <div className="flex items-center">
                                                    <Calendar size={14} className="mr-1 text-purple-400" />
                                                    {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleCancelBooking(booking.bookingId)}
                                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/30"
                                                title="Reject Booking"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <Button
                                                onClick={() => handleApproveBooking(booking.bookingId)}
                                                disabled={actionLoading === booking.bookingId}
                                                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                                            >
                                                {actionLoading === booking.bookingId ? 'Processing...' : 'Approve'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;