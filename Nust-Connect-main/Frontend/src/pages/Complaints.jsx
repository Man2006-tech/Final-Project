import { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Send, FileText, TrendingUp, Loader2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Complaints = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        category: 'Academic',
        subject: '',
        description: '',
        priority: 'Medium',
    });
    const [myComplaints, setMyComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const categories = ['Academic', 'Infrastructure', 'Hostel', 'Transport', 'Cafeteria', 'Administration', 'Other'];
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    useEffect(() => {
        if (user?.userId) {
            fetchComplaints();
        }
    }, [user]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await feedbackAPI.getUserFeedback(user.userId);
            setMyComplaints(response.data || []);
        } catch (err) {
            console.error('Failed to fetch complaints:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
            'RESOLVED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
            'CLOSED': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' },
        };
        return badges[status] || badges['PENDING'];
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'text-gray-600',
            'Medium': 'text-blue-600',
            'High': 'text-orange-600',
            'Urgent': 'text-red-600',
        };
        return colors[priority] || colors['Medium'];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.userId) {
            setError('You must be logged in to submit a complaint');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            const feedbackData = {
                subject: formData.subject,
                message: formData.description,
                category: formData.category,
                priority: formData.priority.toUpperCase()
            };

            await feedbackAPI.createFeedback(user.userId, feedbackData);

            setSuccess('Complaint submitted successfully!');
            setFormData({
                category: 'Academic',
                subject: '',
                description: '',
                priority: 'Medium',
            });

            // Refresh complaints list
            fetchComplaints();

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            console.error('Failed to submit complaint:', err);
            setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setShowViewModal(true);
    };

    const handleCancelComplaint = async () => {
        if (!selectedComplaint || !user?.userId) return;

        if (!window.confirm('Are you sure you want to cancel this complaint? This action cannot be undone.')) {
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            await feedbackAPI.cancelFeedback(selectedComplaint.feedbackId || selectedComplaint.id, user.userId);
            setSuccess('Complaint cancelled successfully');
            setShowViewModal(false);
            fetchComplaints();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel complaint');
        } finally {
            setSubmitting(false);
        }
    };

    const pendingCount = myComplaints.filter(c => c.status === 'PENDING').length;
    const inProgressCount = myComplaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolvedCount = myComplaints.filter(c => c.status === 'RESOLVED').length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-700 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <MessageSquare className="text-white" size={28} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Complaints & Feedback</h1>
                    </div>
                    <p className="text-red-50 text-lg">Your voice matters - help us improve campus life</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium mb-1">Pending</p>
                            <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
                        </div>
                        <div className="p-3 bg-yellow-500 rounded-xl">
                            <Clock className="text-white" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium mb-1">In Progress</p>
                            <p className="text-3xl font-bold text-blue-900">{inProgressCount}</p>
                        </div>
                        <div className="p-3 bg-blue-500 rounded-xl">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Resolved</p>
                            <p className="text-3xl font-bold text-green-900">{resolvedCount}</p>
                        </div>
                        <div className="p-3 bg-green-500 rounded-xl">
                            <CheckCircle className="text-white" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-medium mb-1">Total</p>
                            <p className="text-3xl font-bold text-purple-900">{myComplaints.length}</p>
                        </div>
                        <div className="p-3 bg-purple-500 rounded-xl">
                            <FileText className="text-white" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submit Complaint Form */}
                <Card className="border-none shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Send className="text-red-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Submit New Complaint</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Priority Level *
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {priorities.map((priority) => (
                                    <button
                                        key={priority}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority })}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            formData.priority === priority
                                                ? 'bg-red-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {priority}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Brief description of the issue"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Provide detailed information about your complaint..."
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
                            ></textarea>
                        </div>

                        <Button
                            type="submit"
                            loading={submitting}
                            disabled={submitting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            size="lg"
                        >
                            <Send size={20} className="mr-2" />
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </Button>
                    </form>
                </Card>

                {/* Recent Complaints */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Your Complaints</h2>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="animate-spin text-red-600" size={48} />
                        </div>
                    )}

                    {!loading && myComplaints.length === 0 && (
                        <Card className="text-center py-12">
                            <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No complaints yet</h3>
                            <p className="text-gray-500">Submit your first complaint using the form</p>
                        </Card>
                    )}

                    {!loading && myComplaints.map((complaint) => {
                        const statusBadge = getStatusBadge(complaint.status);
                        return (
                            <Card
                                key={complaint.feedbackId || complaint.id}
                                hoverable
                                className={`border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                                    complaint.status === 'PENDING'
                                        ? 'border-yellow-500'
                                        : complaint.status === 'IN_PROGRESS'
                                        ? 'border-blue-500'
                                        : 'border-green-500'
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${
                                        complaint.status === 'RESOLVED' ? 'bg-green-100' : 'bg-yellow-100'
                                    }`}>
                                        {complaint.status === 'RESOLVED' ? (
                                            <CheckCircle className="text-green-600" size={24} />
                                        ) : (
                                            <AlertCircle className="text-yellow-600" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{complaint.subject}</h3>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{complaint.message}</p>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-3 text-gray-500">
                                                    <span>Category: {complaint.category}</span>
                                                    <span>•</span>
                                                    <span className={`font-semibold ${getPriorityColor(complaint.priority)}`}>
                                                        {complaint.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="text-gray-400">{formatDate(complaint.createdAt)}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewComplaint(complaint)}
                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 border">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <MessageSquare className="text-red-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">💡 Complaint Guidelines</h3>
                        <p className="text-sm text-gray-700">
                            Be specific and provide detailed information. Avoid duplicate complaints. Expect responses within 48-72 hours.
                        </p>
                    </div>
                </div>
            </Card>

            {/* View Complaint Modal */}
            {showViewModal && selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <MessageSquare size={24} />
                                    <h2 className="text-2xl font-bold">Complaint Details</h2>
                                </div>
                                <button
                                    onClick={() => setShowViewModal(false)}
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

                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`text-sm px-3 py-1.5 rounded-full font-semibold ${
                                            getStatusBadge(selectedComplaint.status).bg
                                        } ${getStatusBadge(selectedComplaint.status).text}`}
                                    >
                                        {getStatusBadge(selectedComplaint.status).label}
                                    </span>
                                    <span
                                        className={`text-sm px-3 py-1.5 rounded-full font-semibold ${getPriorityColor(
                                            selectedComplaint.priority
                                        )} bg-gray-100`}
                                    >
                                        {selectedComplaint.priority} Priority
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {formatDate(selectedComplaint.createdAt)}
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject
                                </label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-gray-900 font-medium">{selectedComplaint.subject}</p>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-gray-900">{selectedComplaint.category}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedComplaint.message}
                                    </p>
                                </div>
                            </div>

                            {/* Response (if available) */}
                            {selectedComplaint.response && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Admin Response
                                    </label>
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {selectedComplaint.response}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Complaint ID</p>
                                    <p className="text-sm font-medium text-gray-900">#{selectedComplaint.feedbackId || selectedComplaint.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(selectedComplaint.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex gap-3">
                                {(selectedComplaint.status === 'PENDING' || selectedComplaint.status === 'IN_PROGRESS') && (
                                    <Button
                                        onClick={handleCancelComplaint}
                                        disabled={submitting}
                                        variant="outline"
                                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                                    >
                                        {submitting ? 'Cancelling...' : 'Cancel Complaint'}
                                    </Button>
                                )}
                                <Button
                                    onClick={() => setShowViewModal(false)}
                                    className={`${selectedComplaint.status === 'PENDING' || selectedComplaint.status === 'IN_PROGRESS' ? 'flex-1' : 'w-full'} bg-red-600 hover:bg-red-700 text-white`}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;
