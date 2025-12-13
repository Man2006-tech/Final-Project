import { useState } from 'react';
import { ShoppingBag, Tag, Plus, Search, Filter, Heart, MessageCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Marketplace = () => {
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'Electronics', 'Books', 'Accessories', 'Furniture', 'Other'];

    const placeholderItems = [
        {
            id: 1,
            title: 'Scientific Calculator',
            price: 1500,
            condition: 'Like New',
            seller: 'Ali Ahmed',
            category: 'Electronics',
            image: 'electronics',
            posted: '2 days ago',
            views: 45,
            likes: 12,
        },
        {
            id: 2,
            title: 'Engineering Textbooks Set',
            price: 2000,
            condition: 'Good',
            seller: 'Sara Khan',
            category: 'Books',
            image: 'books',
            posted: '1 day ago',
            views: 68,
            likes: 23,
        },
        {
            id: 3,
            title: 'Laptop Stand - Adjustable',
            price: 800,
            condition: 'New',
            seller: 'Hassan Ali',
            category: 'Accessories',
            image: 'accessories',
            posted: '3 hours ago',
            views: 24,
            likes: 8,
        },
        {
            id: 4,
            title: 'Study Table with Chair',
            price: 5000,
            condition: 'Good',
            seller: 'Fatima Malik',
            category: 'Furniture',
            image: 'furniture',
            posted: '1 week ago',
            views: 92,
            likes: 34,
        },
        {
            id: 5,
            title: 'Wireless Mouse & Keyboard',
            price: 1200,
            condition: 'Like New',
            seller: 'Usman Tariq',
            category: 'Electronics',
            image: 'electronics',
            posted: '5 days ago',
            views: 56,
            likes: 19,
        },
        {
            id: 6,
            title: 'Backpack - Premium Quality',
            price: 1800,
            condition: 'New',
            seller: 'Ayesha Iqbal',
            category: 'Accessories',
            image: 'accessories',
            posted: '2 days ago',
            views: 38,
            likes: 15,
        },
    ];

    const getImageGradient = (image) => {
        const gradients = {
            electronics: 'from-blue-400 to-cyan-600',
            books: 'from-amber-400 to-orange-600',
            accessories: 'from-purple-400 to-pink-600',
            furniture: 'from-green-400 to-emerald-600',
        };
        return gradients[image] || 'from-gray-400 to-gray-600';
    };

    const getConditionBadge = (condition) => {
        const badges = {
            'New': 'bg-green-100 text-green-800',
            'Like New': 'bg-blue-100 text-blue-800',
            'Good': 'bg-yellow-100 text-yellow-800',
            'Fair': 'bg-orange-100 text-orange-800',
        };
        return badges[condition] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <ShoppingBag className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Marketplace</h1>
                        </div>
                        <p className="text-green-100 text-lg">Buy, sell, and discover amazing deals</p>
                    </div>
                    <Button className="bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                        <Plus size={20} className="mr-2" />
                        Sell Item
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                    />
                </div>
                <Button variant="outline" className="flex items-center space-x-2">
                    <Filter size={18} />
                    <span>Filters</span>
                </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat.toLowerCase())}
                        className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                            category === cat.toLowerCase()
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {placeholderItems.map((item) => (
                    <Card
                        key={item.id}
                        hoverable
                        className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group p-0"
                    >
                        {/* Item Image */}
                        <div className={`aspect-square bg-gradient-to-br ${getImageGradient(item.image)} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ShoppingBag size={64} className="text-white/30" />
                            </div>
                            <div className="absolute top-4 right-4 space-y-2">
                                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                                    <Heart size={18} className="text-gray-700" />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConditionBadge(item.condition)}`}>
                                    {item.condition}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                {item.title}
                            </h3>
                            
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="flex items-center text-green-600 font-bold text-2xl">
                                        <span className="text-lg">Rs.</span>
                                        <span className="ml-1">{item.price}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Heart size={14} className="mr-1" />
                                        {item.likes}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center space-x-1">
                                    <Tag size={14} className="text-gray-400" />
                                    <span className="text-gray-600">{item.category}</span>
                                </div>
                                <span className="text-gray-500">{item.posted}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Seller</p>
                                    <p className="font-semibold text-gray-900">{item.seller}</p>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <MessageCircle size={16} className="mr-1" />
                                    Contact
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center">
                <Button variant="outline" size="lg" className="px-8">
                    Load More Items
                </Button>
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <ShoppingBag className="text-green-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">💡 Safe Trading Tips</h3>
                        <p className="text-sm text-gray-700">
                            Always meet in public places on campus. Verify items before payment. Report suspicious activity. Full marketplace features coming soon!
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Marketplace;