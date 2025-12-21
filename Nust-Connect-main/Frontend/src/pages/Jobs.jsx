import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, Plus, Building2, Bookmark, ExternalLink, X, Loader2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
    const { user } = useAuth();
    const [jobType, setJobType] = useState('all');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        companyName: '',
        jobType: 'INTERNSHIP',
        location: '',
        salaryRange: '',
        applicationUrl: '',
        contactEmail: '',
        applicationDeadline: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await jobAPI.getAllJobs();
            setJobs(response.data || []);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
            setError('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.userId) {
            setError('You must be logged in to post a job');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            // Format the deadline as ISO string if provided
            const jobData = {
                ...formData,
                applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null
            };

            await jobAPI.createJob(user.userId, jobData);

            // Reset form and close modal
            setFormData({
                title: '',
                description: '',
                companyName: '',
                jobType: 'INTERNSHIP',
                location: '',
                salaryRange: '',
                applicationUrl: '',
                contactEmail: '',
                applicationDeadline: ''
            });
            setShowModal(false);

            // Refresh jobs list
            fetchJobs();
        } catch (err) {
            console.error('Failed to create job:', err);
            setError(err.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

    const formatDeadline = (dateString) => {
        if (!dateString) return 'No deadline';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getLogoGradient = (type) => {
        const gradients = {
            'INTERNSHIP': 'from-blue-500 to-cyan-600',
            'FULL_TIME': 'from-green-500 to-emerald-600',
            'PART_TIME': 'from-yellow-500 to-orange-600',
            'FREELANCE': 'from-purple-500 to-pink-600',
        };
        return gradients[type] || 'from-gray-500 to-gray-600';
    };

    const getTypeBadge = (type) => {
        const badges = {
            'INTERNSHIP': 'bg-blue-100 text-blue-800',
            'FULL_TIME': 'bg-green-100 text-green-800',
            'PART_TIME': 'bg-yellow-100 text-yellow-800',
            'FREELANCE': 'bg-purple-100 text-purple-800',
        };
        return badges[type] || 'bg-gray-100 text-gray-800';
    };

    const getTypeLabel = (type) => {
        const labels = {
            'INTERNSHIP': 'Internship',
            'FULL_TIME': 'Full-time',
            'PART_TIME': 'Part-time',
            'FREELANCE': 'Freelance',
        };
        return labels[type] || type;
    };

    const filteredJobs = jobType === 'alljobs' || jobType === 'all'
        ? jobs
        : jobs.filter(job => job.jobType?.toLowerCase() === jobType.toLowerCase() || job.jobType === jobType.toUpperCase());

    const totalJobs = jobs.length;
    const internships = jobs.filter(j => j.jobType === 'INTERNSHIP').length;
    const fullTime = jobs.filter(j => j.jobType === 'FULL_TIME').length;
    const remote = jobs.filter(j => j.location?.toLowerCase().includes('remote')).length;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Briefcase className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Jobs & Internships</h1>
                        </div>
                        <p className="text-indigo-50 text-lg">Launch your career with exciting opportunities</p>
                    </div>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus size={20} className="mr-2" />
                        Post a Job
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <Card className="bg-red-50 border-red-200">
                    <p className="text-red-800 text-center">{error}</p>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-md">
                    <p className="text-sm text-indigo-600 font-medium mb-1">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
                </Card>
                <Card className="border-none shadow-md">
                    <p className="text-sm text-blue-600 font-medium mb-1">Internships</p>
                    <p className="text-2xl font-bold text-gray-900">{internships}</p>
                </Card>
                <Card className="border-none shadow-md">
                    <p className="text-sm text-green-600 font-medium mb-1">Full-time</p>
                    <p className="text-2xl font-bold text-gray-900">{fullTime}</p>
                </Card>
                <Card className="border-none shadow-md">
                    <p className="text-sm text-purple-600 font-medium mb-1">Remote</p>
                    <p className="text-2xl font-bold text-gray-900">{remote}</p>
                </Card>
            </div>

            {/* Job Type Filter */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {['All Jobs', 'Internship', 'Full-time', 'Part-time'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setJobType(type.toLowerCase().replace('-', '_').replace(' ', ''))}
                        className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                            jobType === type.toLowerCase().replace('-', '_').replace(' ', '')
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-indigo-600" size={48} />
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredJobs.length === 0 && (
                <Card className="text-center py-12">
                    <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                    <p className="text-gray-500">
                        Be the first to post a job opportunity!
                    </p>
                </Card>
            )}

            {/* Jobs List */}
            {!loading && !error && filteredJobs.length > 0 && (
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <Card
                            key={job.jobId}
                            hoverable
                            className="border-none shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                                {/* Company Logo */}
                                <div className="flex-shrink-0">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${getLogoGradient(job.jobType)} rounded-2xl flex items-center justify-center shadow-lg`}>
                                        <Building2 className="text-white" size={32} />
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-bold text-xl text-gray-900 hover:text-indigo-600 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getTypeBadge(job.jobType)}`}>
                                                    {getTypeLabel(job.jobType)}
                                                </span>
                                                {job.location?.toLowerCase().includes('remote') && (
                                                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-800">
                                                        Remote
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 font-medium mb-3">{job.companyName}</p>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Bookmark className="text-gray-400" size={20} />
                                        </button>
                                    </div>

                                    {/* Job Meta */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin size={16} className="mr-2 text-indigo-600" />
                                            <span>{job.location || 'Not specified'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <DollarSign size={16} className="mr-2 text-green-600" />
                                            <span>{job.salaryRange || 'Negotiable'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-2 text-blue-600" />
                                            <span>{job.viewCount || 0} views</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-2 text-red-600" />
                                            <span>Deadline: {formatDeadline(job.applicationDeadline)}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">Posted {formatDate(job.createdAt)}</span>
                                        <div className="flex items-center space-x-3">
                                            {job.applicationUrl && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(job.applicationUrl, '_blank')}
                                                    className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                                                >
                                                    <ExternalLink size={16} className="mr-1" />
                                                    Apply Now
                                                </Button>
                                            )}
                                            {job.contactEmail && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => window.location.href = `mailto:${job.contactEmail}`}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                >
                                                    Contact
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 border">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Briefcase className="text-indigo-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">💡 Career Tips</h3>
                        <p className="text-sm text-gray-700">
                            Keep your resume updated. Apply early to increase your chances. Prepare well for interviews. Network with professionals in your field!
                        </p>
                    </div>
                </div>
            </Card>

            {/* Post Job Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    placeholder="e.g., Software Engineering Intern"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    placeholder="e.g., Tech Solutions Ltd"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Type *
                                    </label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                                    >
                                        <option value="INTERNSHIP">Internship</option>
                                        <option value="FULL_TIME">Full-time</option>
                                        <option value="PART_TIME">Part-time</option>
                                        <option value="FREELANCE">Freelance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                        placeholder="e.g., Islamabad / Remote"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Salary Range
                                </label>
                                <input
                                    type="text"
                                    name="salaryRange"
                                    value={formData.salaryRange}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    placeholder="e.g., 30k-40k"
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
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
                                    placeholder="Describe the job responsibilities, requirements, and qualifications..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Application URL
                                </label>
                                <input
                                    type="url"
                                    name="applicationUrl"
                                    value={formData.applicationUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    placeholder="https://example.com/apply"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                        placeholder="hr@company.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        name="applicationDeadline"
                                        value={formData.applicationDeadline}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={submitting}
                                    disabled={submitting}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {submitting ? 'Posting...' : 'Post Job'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Jobs;
