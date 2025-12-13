import { useState } from 'react';
import { Search, MapPin, Clock, Plus, AlertCircle, CheckCircle, Phone, Mail } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const LostFound = () => {
    const [activeTab, setActiveTab] = useState('lost'); // lost, found

    const placeholderItems = [
        {
            id: 1,
            type: 'lost',
            item: 'Black Wallet',
            description: 'Black leather wallet with ID cards',
            location: 'Library',
            date: '2 days ago',
            reporter: 'Ahmed Ali',
            contact: 'ahmed@nust.edu.pk',
            category: 'Personal Items',
            status: 'active',
        },
        {
            id: 2,
            type: 'found',
            item: 'Student ID Card',
            description: 'ID card with name "Sarah Khan"',
            location: 'Cafeteria',
            date: '1 day ago',
            reporter: 'Sara Khan',
            contact: 'sara@nust.edu.pk',
            category: 'Documents',
            status: 'active',
        },
        {
            id: 3,
            type: 'lost',
            item: 'AirPods Pro',
            description: 'White AirPods with charging case',
            location: 'Auditorium',
            date: '5 hours ago',
            reporter: 'Hassan Raza',
            contact: 'hassan@nust.edu.pk',
            category: 'Electronics',
            status: 'active',
        },
        {
            id: 4,
            type: 'found',
            item: 'House Keys',
            description: 'Set of 3 keys with blue keychain',
            location: 'Sports Complex',
            date: '3 days ago',
            reporter: 'Fatima Ahmed',
            contact: 'fatima@nust.edu.pk',
            category: 'Personal Items',
            status: 'claimed',
        },
        {
            id: 5,
            type: 'lost',
            item: 'Blue Notebook',
            description: 'Engineering notes, blue cover',
            location: 'Main Block',
            date: '1 week ago',
            reporter: 'Usman Ali',
            contact: 'usman@nust.edu.pk',
            category: 'Study Materials',
            status: 'active',
        },
        {
            id: 6,
            type: 'found',
            item: 'Calculator',
            description: 'Scientific calculator - Casio',
            location: 'Computer Lab',
            date: '4 days ago',
            reporter: 'Ayesha Khan',
            contact: 'ayesha@nust.edu.pk',
            category: 'Study Materials',
            status: 'active',
        },
    ];

    const categories = ['All', 'Personal Items', 'Electronics', 'Documents', 'Study Materials', 'Other'];

    const getCategoryIcon = (category) => {
        // You can customize icons per category
        return <AlertCircle size={20} />;
    };

    const filteredItems = placeholderItems.filter(item => item.type === activeTab);

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
                        <p className="text-orange-100 text-lg">Help reunite lost items with their owners</p>
                    </div>
                    <Button className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                        <Plus size={20} className="mr-2" />
                        Report Item
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium mb-1">Lost Items</p>
                            <p className="text-3xl font-bold text-red-900">
                                {placeholderItems.filter(i => i.type === 'lost' && i.status === 'active').length}
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
                                {placeholderItems.filter(i => i.type === 'found' && i.status === 'active').length}
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
                                {placeholderItems.filter(i => i.status === 'claimed').length}
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

            {/* Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                    <Card
                        key={item.id}
                        hoverable
                        className={`border-l-4 ${
                            item.type === 'lost' ? 'border-red-500' : 'border-green-500'
                        } shadow-lg hover:shadow-xl transition-all duration-300 ${
                            item.status === 'claimed' ? 'opacity-60' : ''
                        }`}
                    >
                        <div className="flex items-start space-x-4">
                            {/* Icon */}
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                    item.type === 'lost' ? 'bg-red-100' : 'bg-green-100'
                                }`}
                            >
                                {item.type === 'lost' ? (
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
                                            <h3 className="font-bold text-lg text-gray-900">{item.item}</h3>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                                    item.type === 'lost'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {item.type.toUpperCase()}
                                            </span>
                                            {item.status === 'claimed' && (
                                                <span className="text-xs px-2 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">
                                                    CLAIMED
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                        
                                        <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <MapPin size={14} className="mr-2 text-gray-400" />
                                                <span>{item.location}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock size={14} className="mr-2 text-gray-400" />
                                                <span>{item.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500">Reported by</p>
                                                <p className="font-semibold text-gray-900">{item.reporter}</p>
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
                                                        item.type === 'lost'
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

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 border">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Search className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">💡 How It Works</h3>
                        <p className="text-sm text-gray-700">
                            Lost something? Report it here. Found something? Help return it to its owner. Together, we can keep our campus connected! Full integration coming soon.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LostFound;