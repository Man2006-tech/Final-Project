import { useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Send, FileText, TrendingUp } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Complaints = () => {
    const [formData, setFormData] = useState({
        category: 'Academic',
        subject: '',
        description: '',
        priority: 'Medium',
    });

    const categories = ['Academic', 'Infrastructure', 'Hostel', 'Transport', 'Cafeteria', 'Administration', 'Other'];
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    const myComplaints = [
        {
            id: 1,
            title: 'Library AC Issue',
            category: 'Infrastructure',
            status: 'pending',
            priority: 'High',
            date: '2 days ago',
            description: 'Air conditioning not working properly in the main library',
            responses: 1,
        },
        {
            id: 2,
            title: 'Course Material Not Available',
            category: 'Academic',
            status: 'resolved',
            priority: 'Medium',
            date: '5 days ago',
            description: 'Requested course materials not uploaded on LMS',
            responses: 3,
        },
        {
            id: 3,
            title: 'Hostel Wifi Issues',
            category: 'Hostel',
            status: 'in-progress',
            priority: 'High',
            date: '1 day ago',
            description: 'WiFi connection keeps dropping frequently',
            responses: 2,
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
            'resolved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
            'closed': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' },
        };
        return badges[status] || badges['pending'];
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting complaint:', formData);
        // Handle submission
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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
                    <p className="text-red-100 text-lg">Your voice matters - help us improve campus life</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium mb-1">Pending</p>
                            <p className="text-3xl font-bold text-yellow-900">
                                {myComplaints.filter(c => c.status === 'pending').length}
                            </p>
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
                            <p className="text-3xl font-bold text-blue-900">
                                {myComplaints.filter(c => c.status === 'in-progress').length}
                            </p>
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
                            <p className="text-3xl font-bold text-green-900">
                                {myComplaints.filter(c => c.status === 'resolved').length}
                            </p>
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
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                            ></textarea>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            size="lg"
                        >
                            <Send size={20} className="mr-2" />
                            Submit Complaint
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

                    {myComplaints.map((complaint) => {
                        const statusBadge = getStatusBadge(complaint.status);
                        return (
                            <Card
                                key={complaint.id}
                                hoverable
                                className={`border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                                    complaint.status === 'pending'
                                        ? 'border-yellow-500'
                                        : complaint.status === 'in-progress'
                                        ? 'border-blue-500'
                                        : 'border-green-500'
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${
                                        complaint.status === 'resolved' ? 'bg-green-100' : 'bg-yellow-100'
                                    }`}>
                                        {complaint.status === 'resolved' ? (
                                            <CheckCircle className="text-green-600" size={24} />
                                        ) : (
                                            <AlertCircle className="text-yellow-600" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{complaint.title}</h3>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{complaint.description}</p>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-3 text-gray-500">
                                                    <span>Category: {complaint.category}</span>
                                                    <span>•</span>
                                                    <span className={`font-semibold ${getPriorityColor(complaint.priority)}`}>
                                                        {complaint.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="text-gray-400">{complaint.date}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-500">
                                                    {complaint.responses} responses
                                                </span>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                                    View
                                                </Button>
                                            </div>
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
                            Be specific and provide detailed information. Avoid duplicate complaints. Expect responses within 48-72 hours. Full complaint tracking system coming soon!
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Complaints;