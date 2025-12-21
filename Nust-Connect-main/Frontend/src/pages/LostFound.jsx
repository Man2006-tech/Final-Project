import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Plus, AlertCircle, CheckCircle, Phone, Mail, Loader2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { lostFoundAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LostFound = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('lost'); // lost, found
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [reportType, setReportType] = useState('lost'); // lost or found
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        itemName: '',
        description: '',
        location: '',
        dateOccurred: '',
        contactInfo: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError('');
            const [lostRes, foundRes] = await Promise.all([
                lostFoundAPI.getLostItems(),
                lostFoundAPI.getFoundItems()
            ]);

            setLostItems(lostRes.data || []);
            setFoundItems(foundRes.data || []);
        } catch (err) {
            console.error('Failed to fetch lost & found items:', err);
            setError('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setReportType('lost');
        setError('');
        setSuccess('');
        // Pre-fill contact info from user's email
        setFormData(prev => ({
            ...prev,
            contactInfo: user?.email || user?.phone || ''
        }));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.userId) {
            setError('You must be logged in to report an item');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            const itemData = {
                itemName: formData.itemName,
                description: formData.description,
                contactInfo: user.email || '',
                imageUrl: null,
            };

            if (reportType === 'lost') {
                itemData.locationLost = formData.location;
                itemData.dateLost = formData.dateOccurred ? new Date(formData.dateOccurred).toISOString() : null;
                await lostFoundAPI.reportLostItem(user.userId, itemData);
            } else {
                itemData.locationFound = formData.location;
                itemData.dateFound = formData.dateOccurred ? new Date(formData.dateOccurred).toISOString() : null;
                await lostFoundAPI.reportFoundItem(user.userId, itemData);
            }

            setSuccess(`Item reported successfully as ${reportType}!`);
            setShowModal(false);
            setFormData({
                itemName: '',
                description: '',
                location: '',
                dateOccurred: '',
                contactInfo: ''
            });

            // Refresh items list
            fetchItems();

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            console.error('Failed to report item:', err);
            setError(err.response?.data?.message || 'Failed to report item. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItems = activeTab === 'lost' ? lostItems : foundItems;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Search className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Lost & Found</h1>
                        </div>
                        <p className="text-orange-50 text-lg">Help reunite lost items with their owners</p>
                    </div>
                    <Button
                        onClick={handleOpenModal}
                        className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus size={20} className="mr-2" />
                        Report Item
                    </Button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {error && (
                <Card className="bg-red-50 border-red-200">
                    <p className="text-red-800 text-center">{error}</p>
                </Card>
            )}
            {success && (
                <Card className="bg-green-50 border-green-200">
                    <p className="text-green-800 text-center">{success}</p>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium mb-1">Lost Items</p>
                            <p className="text-3xl font-bold text-red-900">
                                {lostItems.filter(i => i.status === 'ACTIVE').length}
                            </p>
                        </div>
                        <div className="p-3 bg-red-500 rounded-xl">
                            <AlertCircle className="text-white" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Found Items</p>
                            <p className="text-3xl font-bold text-green-900">
                                {foundItems.filter(i => i.status === 'ACTIVE').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-500 rounded-xl">
                            <CheckCircle className="text-white" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium mb-1">Reunited</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {[...lostItems, ...foundItems].filter(i => i.status === 'CLAIMED').length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-500 rounded-xl">
                            <CheckCircle className="text-white" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-md w-fit">
                <button
                    onClick={() => setActiveTab('lost')}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                        activeTab === 'lost'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Lost Items
                </button>
                <button
                    onClick={() => setActiveTab('found')}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                        activeTab === 'found'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Found Items
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-orange-600" size={48} />
                </div>
            )}

            {/* Error State */}
            {error && (
                <Card className="bg-red-50 border-red-200">
                    <p className="text-red-800 text-center">{error}</p>
                </Card>
            )}

            {/* Empty State */}
            {!loading && !error && filteredItems.length === 0 && (
                <Card className="text-center py-12">
                    <Search size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                    <p className="text-gray-500">
                        Be the first to report a {activeTab} item!
                    </p>
                </Card>
            )}

            {/* Items Grid */}
            {!loading && !error && filteredItems.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            hoverable
                            className={`border-l-4 ${
                                activeTab === 'lost' ? 'border-red-500' : 'border-green-500'
                            } shadow-lg hover:shadow-xl transition-all duration-300 ${
                                item.status === 'CLAIMED' ? 'opacity-60' : ''
                            }`}
                        >
                            <div className="flex items-start space-x-4">
                                {/* Icon */}
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                        activeTab === 'lost' ? 'bg-red-100' : 'bg-green-100'
                                    }`}
                                >
                                    {activeTab === 'lost' ? (
                                        <AlertCircle className="text-red-600" size={28} />
                                    ) : (
                                        <CheckCircle className="text-green-600" size={28} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-bold text-lg text-gray-900">{item.itemName}</h3>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                                        activeTab === 'lost'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {activeTab.toUpperCase()}
                                                </span>
                                                {item.status === 'CLAIMED' && (
                                                    <span className="text-xs px-2 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">
                                                        CLAIMED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                                            <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center">
                                                    <MapPin size={14} className="mr-2 text-gray-400" />
                                                    <span>{item.location || 'NUST Campus'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock size={14} className="mr-2 text-gray-400" />
                                                    <span>{formatDate(item.createdAt)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div>
                                                    <p className="text-xs text-gray-500">Reported by</p>
                                                    <p className="font-semibold text-gray-900">{item.reporter?.name || 'Student'}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Mail size={16} className="mr-1" />
                                                        Email
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className={`${
                                                            activeTab === 'lost'
                                                                ? 'bg-red-600 hover:bg-red-700'
                                                                : 'bg-green-600 hover:bg-green-700'
                                                        } text-white`}
                                                    >
                                                        <Phone size={16} className="mr-1" />
                                                        Contact
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 border">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Search className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">💡 How It Works</h3>
                        <p className="text-sm text-gray-700">
                            Lost something? Report it here. Found something? Help return it to its owner. Together, we can keep our campus connected!
                        </p>
                    </div>
                </div>
            </Card>

            {/* Report Item Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Report Item</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Report Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Report Type *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setReportType('lost')}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                            reportType === 'lost'
                                                ? 'bg-red-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Lost Item
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReportType('found')}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                            reportType === 'found'
                                                ? 'bg-green-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Found Item
                                    </button>
                                </div>
                            </div>

                            {/* Item Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    placeholder="e.g., Black Backpack, iPhone 13, Wallet"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Provide detailed information about the item (color, brand, distinctive features, etc.)"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
                                ></textarea>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Library, Cafeteria, SEECS Building"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* Date Occurred */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Date {reportType === 'lost' ? 'Lost' : 'Found'}
                                </label>
                                <input
                                    type="date"
                                    name="dateOccurred"
                                    value={formData.dateOccurred}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900"
                                />
                            </div>

                            {/* Contact Info */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact Info (Email/Phone)
                                </label>
                                <input
                                    type="text"
                                    name="contactInfo"
                                    value={formData.contactInfo}
                                    onChange={handleChange}
                                    placeholder="e.g., your@email.com or 03XX-XXXXXXX"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    So people can contact you if they find your item
                                </p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={submitting}
                                    disabled={submitting}
                                    className={`flex-1 ${
                                        reportType === 'lost'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                    } text-white shadow-lg`}
                                >
                                    {submitting ? 'Reporting...' : `Report ${reportType === 'lost' ? 'Lost' : 'Found'} Item`}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LostFound;
