import { useState, useEffect } from 'react';
import {
    Users, Plus, Search, Filter, Shield, Award, BookOpen,
    Zap, Heart, Trophy, Share2, MoreVertical, X, CheckCircle, AlertTriangle
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { clubAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Clubs = () => {
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, academic, cultural, sports
    const [searchTerm, setSearchTerm] = useState('');

    // Create Club Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [createData, setCreateData] = useState({
        name: '',
        description: '',
        category: 'ACADEMIC',
        logoUrl: '',
        coverImageUrl: '',
        contactEmail: ''
    });

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            setLoading(true);
            const response = await clubAPI.getAllClubs();
            setClubs(response.data);
        } catch (err) {
            console.error("Failed to fetch clubs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClub = async (clubId) => {
        try {
            await clubAPI.joinClub(clubId, user.userId);
            // Show success toast or refresh
            fetchClubs();
        } catch (err) {
            console.error("Failed to join club", err);
            // Optionally set an error state to show a toast
        }
    };

    const handleLeaveClub = async (clubId) => {
        if (!window.confirm("Are you sure you want to leave this club?")) return;
        try {
            await clubAPI.leaveClub(clubId, user.userId);
            fetchClubs();
        } catch (err) {
            console.error("Failed to leave club", err);
        }
    };

    const handleToggleRecruitment = async (clubId) => {
        try {
            await clubAPI.toggleRecruitment(clubId);
            fetchClubs();
        } catch (err) {
            console.error("Failed to toggle recruitment", err);
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();
        setCreating(true);
        setCreateError('');

        try {
            await clubAPI.createClub(user.userId, createData);
            setCreateSuccess(true);
            fetchClubs();
            setTimeout(() => {
                setShowCreateModal(false);
                setCreateSuccess(false);
                setCreating(false);
                setCreateData({
                    name: '', description: '', category: 'ACADEMIC',
                    logoUrl: '', coverImageUrl: '', contactEmail: ''
                });
            }, 2000);
        } catch (err) {
            console.error(err);
            setCreateError(err.response?.data?.message || err.message || "Failed to create club");
            setCreating(false);
        }
    };

    const getFilteredClubs = () => {
        return clubs.filter(club => {
            const matchesCategory = filter === 'all' || club.category === filter.toUpperCase();
            const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                club.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'ACADEMIC': return <BookOpen size={20} className="text-blue-500" />;
            case 'CULTURAL': return <Heart size={20} className="text-pink-500" />;
            case 'SPORTS': return <Trophy size={20} className="text-orange-500" />;
            default: return <Users size={20} className="text-gray-500" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'ACADEMIC': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'CULTURAL': return 'text-pink-600 bg-pink-50 border-pink-100';
            case 'SPORTS': return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header / Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 px-8 py-12 md:py-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
                            <Shield size={14} className="mr-2 text-blue-400" />
                            Official NUST Organizations
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Find Your Community at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">NUST Connect</span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 max-w-xl">
                            Join student-led clubs, participate in events, and build your network.
                            From tech societies to sports teams, there's a place for everyone.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {user?.role === 'ADMIN' && (
                                <Button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-900/50"
                                >
                                    <Plus size={20} className="mr-2" />
                                    Start a New Club
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                                onClick={() => document.getElementById('browse-clubs')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Browse All Clubs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="browse-clubs" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search clubs, societies..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['all', 'academic', 'cultural', 'sports'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${filter === cat
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clubs Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : getFilteredClubs().length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No clubs found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredClubs().map(club => (
                        <Card key={club.clubId} className="group hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden flex flex-col h-full">
                            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                                {club.coverImageUrl && (
                                    <img src={club.coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-50" />
                                )}
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                        <div className="w-full h-full rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                                            {club.logoUrl ? (
                                                <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="text-gray-400" size={32} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(club.category)}`}>
                                        {club.category}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-12 px-6 pb-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {club.name}
                                    </h3>
                                </div>

                                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                                    {club.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Users size={16} className="mr-2" />
                                        <span>{club.memberCount || 0} Members</span>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                        disabled={!club.isRecruitmentOpen && user.role !== 'ADMIN'}
                                        onClick={() => handleJoinClub(club.clubId)}
                                    >
                                        {!club.isRecruitmentOpen ? 'Recruitment Closed' : 'Join Club'}
                                    </Button>
                                    {user?.role === 'ADMIN' && (
                                        <Button
                                            size="sm"
                                            className="ml-2 bg-slate-800 text-white"
                                            onClick={() => handleToggleRecruitment(club.clubId)}
                                        >
                                            {club.isRecruitmentOpen ? 'Close' : 'Open'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Club Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Start a Club</h2>
                                <p className="text-sm text-gray-500">Register a new student organization</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {createSuccess ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle size={32} className="text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Club Created!</h3>
                                    <p className="text-gray-500">Your club is now live and students can join.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateClub} className="space-y-4">
                                    {createError && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                                            <AlertTriangle size={16} className="mr-2" />
                                            {createError}
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Club Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={createData.name}
                                            onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={createData.description}
                                            onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={createData.category}
                                            onChange={(e) => setCreateData({ ...createData, category: e.target.value })}
                                        >
                                            <option value="ACADEMIC">Academic</option>
                                            <option value="CULTURAL">Cultural</option>
                                            <option value="SPORTS">Sports</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Contact Email</label>
                                        <input
                                            type="email"
                                            placeholder="club@nust.edu.pk"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={createData.contactEmail}
                                            onChange={(e) => setCreateData({ ...createData, contactEmail: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Logo URL (Optional)</label>
                                            <input
                                                type="url"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={createData.logoUrl}
                                                onChange={(e) => setCreateData({ ...createData, logoUrl: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Cover URL (Optional)</label>
                                            <input
                                                type="url"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={createData.coverImageUrl}
                                                onChange={(e) => setCreateData({ ...createData, coverImageUrl: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                        <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            loading={creating}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Create Club
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clubs;
