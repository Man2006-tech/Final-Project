import { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, Plus, Building2, Bookmark, ExternalLink } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Jobs = () => {
    const [jobType, setJobType] = useState('all'); // all, internship, fulltime, parttime

    const placeholderJobs = [
        {
            id: 1,
            title: 'Software Engineering Intern',
            company: 'Tech Solutions Ltd',
            location: 'Islamabad',
            type: 'Internship',
            salary: '30k-40k',
            deadline: 'Dec 15, 2024',
            posted: '2 days ago',
            logo: 'tech',
            remote: false,
            skills: ['React', 'Node.js', 'MongoDB'],
            experience: 'Fresher',
        },
        {
            id: 2,
            title: 'Data Analyst',
            company: 'Analytics Corp',
            location: 'Rawalpindi',
            type: 'Full-time',
            salary: '60k-80k',
            deadline: 'Dec 20, 2024',
            posted: '1 day ago',
            logo: 'analytics',
            remote: false,
            skills: ['Python', 'SQL', 'Tableau'],
            experience: '1-2 years',
        },
        {
            id: 3,
            title: 'UI/UX Designer',
            company: 'Creative Studio',
            location: 'Remote',
            type: 'Part-time',
            salary: '40k-50k',
            deadline: 'Dec 25, 2024',
            posted: '5 hours ago',
            logo: 'creative',
            remote: true,
            skills: ['Figma', 'Adobe XD', 'Prototyping'],
            experience: 'Fresher',
        },
        {
            id: 4,
            title: 'Full Stack Developer',
            company: 'StartupHub',
            location: 'Islamabad',
            type: 'Full-time',
            salary: '80k-120k',
            deadline: 'Dec 30, 2024',
            posted: '3 days ago',
            logo: 'startup',
            remote: true,
            skills: ['MERN Stack', 'AWS', 'Docker'],
            experience: '2-3 years',
        },
        {
            id: 5,
            title: 'Marketing Intern',
            company: 'Brand Agency',
            location: 'Karachi',
            type: 'Internship',
            salary: '25k-35k',
            deadline: 'Dec 18, 2024',
            posted: '1 week ago',
            logo: 'marketing',
            remote: false,
            skills: ['Social Media', 'Content Writing', 'Analytics'],
            experience: 'Fresher',
        },
        {
            id: 6,
            title: 'DevOps Engineer',
            company: 'Cloud Systems',
            location: 'Lahore',
            type: 'Full-time',
            salary: '100k-150k',
            deadline: 'Jan 5, 2025',
            posted: '4 days ago',
            logo: 'cloud',
            remote: true,
            skills: ['Kubernetes', 'Jenkins', 'Terraform'],
            experience: '3+ years',
        },
    ];

    const getLogoGradient = (logo) => {
        const gradients = {
            tech: 'from-blue-500 to-cyan-600',
            analytics: 'from-purple-500 to-pink-600',
            creative: 'from-orange-500 to-red-600',
            startup: 'from-green-500 to-emerald-600',
            marketing: 'from-yellow-500 to-orange-600',
            cloud: 'from-indigo-500 to-purple-600',
        };
        return gradients[logo] || 'from-gray-500 to-gray-600';
    };

    const getTypeBadge = (type) => {
        const badges = {
            'Internship': 'bg-blue-100 text-blue-800',
            'Full-time': 'bg-green-100 text-green-800',
            'Part-time': 'bg-yellow-100 text-yellow-800',
        };
        return badges[type] || 'bg-gray-100 text-gray-800';
    };

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
                        <p className="text-indigo-100 text-lg">Launch your career with exciting opportunities</p>
                    </div>
                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                        <Plus size={20} className="mr-2" />
                        Post a Job
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Jobs', value: '156', color: 'indigo' },
                    { label: 'Internships', value: '48', color: 'blue' },
                    { label: 'Full-time', value: '82', color: 'green' },
                    { label: 'Remote', value: '26', color: 'purple' },
                ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-md">
                        <p className={`text-sm text-${stat.color}-600 font-medium mb-1`}>{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Job Type Filter */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {['All Jobs', 'Internship', 'Full-time', 'Part-time'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setJobType(type.toLowerCase().replace(' ', ''))}
                        className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                            jobType === type.toLowerCase().replace(' ', '')
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {placeholderJobs.map((job) => (
                    <Card
                        key={job.id}
                        hoverable
                        className="border-none shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                            {/* Company Logo */}
                            <div className="flex-shrink-0">
                                <div className={`w-20 h-20 bg-gradient-to-br ${getLogoGradient(job.logo)} rounded-2xl flex items-center justify-center shadow-lg`}>
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
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getTypeBadge(job.type)}`}>
                                                {job.type}
                                            </span>
                                            {job.remote && (
                                                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-800">
                                                    Remote
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Bookmark className="text-gray-400" size={20} />
                                    </button>
                                </div>

                                {/* Job Meta */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <MapPin size={16} className="mr-2 text-indigo-600" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign size={16} className="mr-2 text-green-600" />
                                        <span>{job.salary}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-2 text-blue-600" />
                                        <span>{job.experience}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-2 text-red-600" />
                                        <span>Deadline: {job.deadline}</span>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">Posted {job.posted}</span>
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                                        >
                                            <ExternalLink size={16} className="mr-1" />
                                            View Details
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center">
                <Button variant="outline" size="lg" className="px-8">
                    Load More Jobs
                </Button>
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 border">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Briefcase className="text-indigo-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">💡 Career Tips</h3>
                        <p className="text-sm text-gray-700">
                            Keep your resume updated. Apply early to increase your chances. Prepare well for interviews. Full job portal features with application tracking coming soon!
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Jobs;