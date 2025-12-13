import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Mail, Phone, Book, MapPin, Calendar, Camera, Save, X } from 'lucide-react';
import Button from '../components/common/Button';

const Profile = () => {
    const { user: authUser, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cmsId: '',
        department: '',
        address: '',
        semester: '',
        bio: '',
        profilePicture: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [authUser]);

    const fetchProfile = async () => {
        try {
            if (!authUser?.userId) return;

            // Fetch fresh user data including profile
            const response = await userAPI.getProfile(authUser.userId);
            // OR if getProfile returns Profile entity, we might need user info too.
            // But usually we get user + profile merged or separate.
            // Let's assume userAPI.getProfile returns the extended UserResponseDTO we configured.
            // Wait, standard is GET /users/{id} returns UserResponseDTO
            // GET /users/{id}/profile returns ProfileResponseDTO
            // Let's use GET /users/{id} as it has the merged fields now

            const userResponse = await userAPI.getProfile(authUser.userId); // This actually calls /users/{id} in api.js? No, api.js: getProfile: (userId) => api.get(`/users/${userId}`)

            if (userResponse.data) {
                const data = userResponse.data;
                setProfile(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || data.phoneNumber || '',
                    cmsId: data.cmsId || data.studentId || '',
                    department: data.department || '',
                    address: data.address || '',
                    semester: data.semester || '',
                    bio: data.bio || 'No bio yet.',
                    profilePicture: data.profilePicture || ''
                });
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
            setError('Could not load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Check api.js: updateProfile: (userId, data) => api.put(`/users/${userId}`, data)
            // This maps to UserController.updateUser which handles both User and Profile updates now.

            const response = await userAPI.updateProfile(authUser.userId, formData);

            setProfile(response.data);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);

            // Refresh to ensure sync
            fetchProfile();

        } catch (err) {
            console.error('Update failed', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to update profile. Please try again.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'FACULTY': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Cover */}
            {/* Header / Cover */}
            {/* Header / Cover */}
            <div className="relative mb-24 z-0">
                {/* Banner Background */}
                <div className="h-48 rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 shadow-2xl relative overflow-hidden z-0">
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Profile Info - Inside Banner */}
                <div className="absolute bottom-6 left-8 flex items-end space-x-6 z-20 w-[calc(100%-4rem)] pointer-events-none">
                    <div className="relative group shrink-0 pointer-events-auto">
                        <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm p-1 shadow-xl ring-1 ring-white/30">
                            <div className="w-full h-full rounded-xl bg-slate-900/50 overflow-hidden flex items-center justify-center text-4xl font-bold text-white relative">
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-white/80" />
                                )}
                            </div>
                        </div>

                        {/* Edit Overlay / Input */}
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append('file', file);

                                        try {
                                            // Show loading state if needed
                                            const response = await userAPI.uploadFile(formData);
                                            setFormData(prev => ({
                                                ...prev,
                                                profilePicture: response.data.fileDownloadUri
                                            }));
                                        } catch (error) {
                                            console.error('File upload failed', error);
                                            setError('Failed to upload image');
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute inset-0 m-1 rounded-xl flex flex-col items-center justify-center bg-black/60 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:backdrop-blur-sm"
                                >
                                    <Camera size={28} className="text-white drop-shadow-md mb-2" />
                                    <span className="text-white text-xs font-medium tracking-wide">Change Photo</span>
                                </label>
                            </>
                        )}
                    </div>

                    <div className="pb-4 mb-2 pointer-events-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="text-3xl font-bold text-white bg-transparent border-b-2 border-white/50 outline-none w-full sm:w-auto placeholder-white/50"
                                    placeholder="Your Name"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-white drop-shadow-md">{profile?.name || 'User'}</h1>
                            )}

                            <span className={`self-start sm:self-auto px-2 py-0.5 mt-1 sm:mt-0 rounded-full text-xs font-bold border bg-black/20 text-white border-white/20 backdrop-blur-md`}>
                                {profile?.role}
                            </span>
                        </div>
                        <p className="text-blue-100 font-medium drop-shadow-sm">{profile?.email}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-16 sm:pt-4">
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex space-x-3">
                        <Button onClick={() => { setIsEditing(false); fetchProfile(); }} variant="ghost">
                            <X size={18} className="mr-2" /> Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="primary" loading={saving}>
                            <Save size={18} className="mr-2" /> Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl animate-fade-in">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-200 p-4 rounded-xl animate-fade-in">
                    {success}
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <User className="mr-2 text-primary-400" size={20} /> Personal Info
                        </h2>
                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none transition-colors"
                                    />
                                ) : (
                                    <p className="text-slate-300 flex items-center"><Phone size={14} className="mr-2 opacity-50" /> {formData.phone || 'N/A'}</p>
                                )}
                            </div>

                            <div className="group">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Address</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none transition-colors"
                                    />
                                ) : (
                                    <p className="text-slate-300 flex items-center"><MapPin size={14} className="mr-2 opacity-50" /> {formData.address || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Book className="mr-2 text-secondary-400" size={20} /> Academic
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">CMS ID</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="cmsId"
                                        value={formData.cmsId}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none transition-colors"
                                    />
                                ) : (
                                    <p className="text-lg font-mono text-white tracking-wide">{formData.cmsId || 'N/A'}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Department</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none transition-colors"
                                    />
                                ) : (
                                    <p className="text-slate-300">{formData.department || 'N/A'}</p>
                                )}
                            </div>
                            <div className="group">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Semester</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 outline-none transition-colors"
                                    />
                                ) : (
                                    <p className="text-slate-300 flex items-center"><Calendar size={14} className="mr-2 opacity-50" /> {formData.semester || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Bio & Other */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-lg h-full">
                        <h2 className="text-xl font-bold text-white mb-4">Bio</h2>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={6}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors leading-relaxed"
                                placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {formData.bio}
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;