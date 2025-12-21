import { useState, useEffect } from 'react';
import { uploadToCloudinary, uploadMultipleImages, validateImageFile } from '../utils/imageUpload';
import { ShoppingBag, Tag, Plus, Search, Filter, Heart, MessageCircle, Loader2, X, Trash2, Image as ImageIcon } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { marketplaceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Marketplace = () => {
    const { user } = useAuth();
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // ✅ FIXED: Added missing state
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('marketplace_wishlist');
        return saved ? JSON.parse(saved) : [];
    });
    const [availableCategories, setAvailableCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        conditionStatus: 'USED',
        location: '',
        imageUrls: [],
        categoryId: ''
    });

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await marketplaceAPI.getAllItems(0, 100);
            setItems(response.data.content || response.data || []);
        } catch (err) {
            console.error('Error fetching marketplace items:', err);
            setError('Failed to load marketplace items');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await marketplaceAPI.getCategories();
            setAvailableCategories(response.data || []);
            
            // ✅ FIXED: Set default category if available
            if (response.data && response.data.length > 0 && !formData.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await marketplaceAPI.deleteItem(itemId);
            fetchItems();
            setSuccess('Item deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error("Failed to delete item", err);
            setError('Failed to delete item');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.userId) {
            setError('You must be logged in to sell an item');
            return;
        }

        // ✅ FIXED: Validate category selection
        if (!formData.categoryId) {
            setError('Please select a category');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            await marketplaceAPI.createItem(user.userId, formData);

            setSuccess('Item listed successfully!');
            setTimeout(() => setSuccess(''), 3000);

            setFormData({
                title: '',
                description: '',
                price: '',
                conditionStatus: 'USED',
                location: '',
                imageUrls: [],
                categoryId: availableCategories.length > 0 ? availableCategories[0].id : ''
            });
            setShowModal(false);
            fetchItems();
        } catch (err) {
            console.error('Failed to create item:', err);
            setError(err.response?.data?.message || 'Failed to list item. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? (value === '' ? '' : parseFloat(value) || 0) : value
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        for (const file of files) {
            const validation = validateImageFile(file, 5);
            if (!validation.valid) {
                setError(validation.error);
                setTimeout(() => setError(''), 3000);
                return;
            }
        }

        setUploadingImage(true);
        setError('');

        try {
            const uploadedUrls = await uploadMultipleImages(files);
            
            setFormData({
                ...formData,
                imageUrls: [...formData.imageUrls, ...uploadedUrls]
            });

            setSuccess(`${files.length} image(s) uploaded successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Failed to upload images:', err);
            setError('Failed to upload images. Please try again.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, index) => index !== indexToRemove)
        });
    };

    const toggleWishlist = (itemId) => {
        setWishlist(prev => {
            const newWishlist = prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId];
            localStorage.setItem('marketplace_wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = category === 'all' || item.categoryName?.toLowerCase() === category.toLowerCase();
        const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
            'NEW': 'bg-green-100 text-green-800',
            'USED': 'bg-blue-100 text-blue-800',
        };
        return badges[condition] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6 animate-fade-in">
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
                        <p className="text-green-50 text-lg">Buy, sell, and discover amazing deals</p>
                    </div>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus size={20} className="mr-2" />
                        Sell Item
                    </Button>
                </div>
            </div>

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

            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                <button
                    onClick={() => setCategory('all')}
                    className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${category === 'all'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                        }`}
                >
                    All
                </button>
                {availableCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.name.toLowerCase())}
                        className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${category === cat.name.toLowerCase()
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-green-600" size={48} />
                </div>
            )}

            {!loading && !error && filteredItems.length === 0 && (
                <Card className="text-center py-12">
                    <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                    <p className="text-gray-500">
                        {searchQuery || category !== 'all'
                            ? 'Try adjusting your filters or search query'
                            : 'Be the first to list an item!'}
                    </p>
                </Card>
            )}

            {!loading && !error && filteredItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            hoverable
                            className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group p-0"
                        >
                            <div className={`aspect-square bg-gradient-to-br ${getImageGradient(item.categoryName?.toLowerCase() || 'other')} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                {item.imageUrls && item.imageUrls.length > 0 ? (
                                    <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ShoppingBag size={64} className="text-white/30" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 space-y-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(item.id);
                                        }}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Heart
                                            size={18}
                                            className={wishlist.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}
                                        />
                                    </button>
                                    {user?.userId === item.seller?.userId && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteItem(item.id);
                                            }}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform text-red-600"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConditionBadge(item.conditionStatus || 'GOOD')}`}>
                                        {item.conditionStatus?.replace('_', ' ') || 'Used'}
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
                                            {item.viewCount || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center space-x-1">
                                        <Tag size={14} className="text-gray-400" />
                                        <span className="text-gray-600">{item.categoryName || 'Other'}</span>
                                    </div>
                                    <span className="text-gray-500 text-xs">
                                        {item.location || 'NUST'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">Seller</p>
                                        <p className="font-semibold text-gray-900">
                                            {item.seller?.name || 'Student'}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => {
                                            if (item.seller?.email) {
                                                window.location.href = `mailto:${item.seller.email}?subject=Interested in ${encodeURIComponent(item.title)}&body=Hi, I am interested in your item "${encodeURIComponent(item.title)}" listed for Rs. ${item.price}.`;
                                            }
                                        }}
                                    >
                                        <MessageCircle size={16} className="mr-1" />
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <ShoppingBag className="text-green-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">💡 Safe Trading Tips</h3>
                        <p className="text-sm text-gray-700">
                            Always meet in public places on campus. Verify items before payment. Report suspicious activity.
                        </p>
                    </div>
                </div>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Sell an Item</h2>
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
                                    Item Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    placeholder="e.g., iPhone 13 Pro"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Price (Rs.) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    placeholder="5000"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Condition *
                                    </label>
                                    <select
                                        name="conditionStatus"
                                        value={formData.conditionStatus}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900"
                                    >
                                        <option value="NEW">New</option>
                                        <option value="USED">Used</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900"
                                    >
                                        <option value="">Select Category</option>
                                        {availableCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {availableCategories.length === 0 && (
                                        <p className="text-xs text-red-500 mt-1">No categories available</p>
                                    )}
                                </div>
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
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    placeholder="e.g., SEECS"
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
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
                                    placeholder="Describe your item, include any defects or special features..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Images (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                {uploadingImage && (
                                    <div className="mt-2 flex items-center text-green-600">
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        <span className="text-sm">Uploading images...</span>
                                    </div>
                                )}
                                {formData.imageUrls.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {formData.imageUrls.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    disabled={submitting || uploadingImage}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {submitting ? 'Listing...' : 'List Item'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Marketplace;