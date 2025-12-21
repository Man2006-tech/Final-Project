import { useState, useEffect } from 'react';
import { venueAPI, venueBookingAPI, eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, Monitor, Volume2, Clipboard, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, X, Building, Search } from 'lucide-react';
import Button from '../components/common/Button';

const VenueBooking = () => {
    const { user } = useAuth();
    const [venues, setVenues] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('venues');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [filterAmenities, setFilterAmenities] = useState({
        projector: false,
        audio: false,
        whiteboard: false,
    });

    const [bookingData, setBookingData] = useState({
        eventId: '',
        startTime: '',
        endTime: '',
        specialRequirements: '',
    });

    useEffect(() => {
        fetchVenues();
        if (user?.userId) {
            fetchMyBookings();
            fetchMyEvents();
        }
    }, [user]);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await venueAPI.getAllVenues();
            setVenues(response.data || []);
        } catch (err) {
            console.error('Failed to fetch venues:', err);
            setError('Failed to load venues');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const response = await venueBookingAPI.getUserBookings(user.userId);
            setMyBookings(response.data || []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        }
    };

    const fetchMyEvents = async () => {
        try {
            const response = await eventAPI.getAllEvents();
            const allEvents = response.data?.content || response.data || [];
            // Filter to only user's created events
            const userEvents = allEvents.filter(event => 
                event.createdBy?.userId === user.userId || 
                event.creator?.userId === user.userId
            );
            setMyEvents(userEvents);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
    };

    const handleOpenBookingModal = (venue) => {
        if (!user) {
            setError('Please login to book a venue');
            setTimeout(() => setError(''), 3000);
            return;
        }
        setSelectedVenue(venue);
        setShowBookingModal(true);
        setBookingData({
            eventId: '',
            startTime: '',
            endTime: '',
            specialRequirements: '',
        });
        setError('');
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setSelectedVenue(null);
        setError('');
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        if (!user?.userId || !selectedVenue) return;

        if (!bookingData.eventId) {
            setError('Please select an event');
            return;
        }

        if (!bookingData.startTime || !bookingData.endTime) {
            setError('Please select start and end times');
            return;
        }

        const startDate = new Date(bookingData.startTime);
        const endDate = new Date(bookingData.endTime);

        if (endDate <= startDate) {
            setError('End time must be after start time');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const booking = {
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                specialRequirements: bookingData.specialRequirements || null,
            };

            await venueBookingAPI.createBooking(
                user.userId,
                selectedVenue.venueId,
                bookingData.eventId,
                booking
            );

            setSuccess('Booking request submitted successfully! Awaiting admin approval.');
            setTimeout(() => setSuccess(''), 5000);
            handleCloseBookingModal();
            fetchMyBookings();
        } catch (err) {
            console.error('Failed to create booking:', err);
            const errorMsg = err.response?.data?.message || 
                           err.response?.data?.error || 
                           'Failed to create booking. Please check if the venue is available for the selected time.';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            setSubmitting(true);
            setError('');
            await venueBookingAPI.cancelBooking(bookingId);
            setSuccess('Booking cancelled successfully');
            setTimeout(() => setSuccess(''), 3000);
            fetchMyBookings();
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            setError(err.response?.data?.message || 'Failed to cancel booking');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredVenues = venues.filter(venue => {
        const matchesAmenities = 
            (!filterAmenities.projector || venue.hasProjector) &&
            (!filterAmenities.audio || venue.hasAudioSystem) &&
            (!filterAmenities.whiteboard || venue.hasWhiteboard);
        
        const matchesSearch = !searchTerm || 
            venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venue.location?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesAmenities && matchesSearch;
    });

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock size={14} />, text: 'Pending' },
            APPROVED: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle size={14} />, text: 'Approved' },
            REJECTED: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle size={14} />, text: 'Rejected' },
            CANCELLED: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <XCircle size={14} />, text: 'Cancelled' },
        };
        const badge = badges[status] || badges.PENDING;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${badge.color}`}>
                {badge.icon}
                {badge.text}
            </span>
        );
    };

    const getAvailabilityBadge = (status) => {
        const badges = {
            AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
            OCCUPIED: 'bg-red-100 text-red-800 border-red-200',
            UNDER_MAINTENANCE: 'bg-orange-100 text-orange-800 border-orange-200',
            UNAVAILABLE: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status] || badges.UNAVAILABLE}`}>
                {status?.replace(/_/g, ' ')}
            </span>
        );
    };

    if (loading && venues.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading venues...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Building className="text-white" size={28} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Venue Booking</h1>
                    </div>
                    <p className="text-purple-50 text-lg">Reserve spaces for your events and activities</p>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center shadow-sm animate-in slide-in-from-top">
                    <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center shadow-sm animate-in slide-in-from-top">
                    <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab('venues')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
                        activeTab === 'venues'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Building size={18} className="inline mr-2" />
                    Available Venues
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
                        activeTab === 'bookings'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Calendar size={18} className="inline mr-2" />
                    My Bookings {myBookings.length > 0 && `(${myBookings.length})`}
                </button>
            </div>

            {/* Venues Tab */}
            {activeTab === 'venues' && (
                <div className="space-y-6">
                    {/* Search and Filters */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search venues by name or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Amenity Filters */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Amenities</h3>
                            <div className="flex flex-wrap gap-3">
                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={filterAmenities.projector}
                                        onChange={(e) => setFilterAmenities({ ...filterAmenities, projector: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Monitor size={18} className="text-gray-600" />
                                    <span className="text-gray-700 font-medium">Projector</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={filterAmenities.audio}
                                        onChange={(e) => setFilterAmenities({ ...filterAmenities, audio: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Volume2 size={18} className="text-gray-600" />
                                    <span className="text-gray-700 font-medium">Audio System</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={filterAmenities.whiteboard}
                                        onChange={(e) => setFilterAmenities({ ...filterAmenities, whiteboard: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Clipboard size={18} className="text-gray-600" />
                                    <span className="text-gray-700 font-medium">Whiteboard</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Venues Grid */}
                    {filteredVenues.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Building size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No venues found</h3>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVenues.map((venue) => (
                                <div key={venue.venueId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    {venue.imageUrl && (
                                        <img
                                            src={venue.imageUrl}
                                            alt={venue.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
                                            {getAvailabilityBadge(venue.availabilityStatus)}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin size={16} className="mr-2 flex-shrink-0" />
                                                <span className="text-sm">{venue.location}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users size={16} className="mr-2 flex-shrink-0" />
                                                <span className="text-sm">Capacity: {venue.capacity} people</span>
                                            </div>
                                        </div>

                                        {venue.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{venue.description}</p>
                                        )}

                                        {/* Amenities */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {venue.hasProjector && (
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs flex items-center gap-1 font-medium">
                                                    <Monitor size={12} /> Projector
                                                </span>
                                            )}
                                            {venue.hasAudioSystem && (
                                                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs flex items-center gap-1 font-medium">
                                                    <Volume2 size={12} /> Audio
                                                </span>
                                            )}
                                            {venue.hasWhiteboard && (
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs flex items-center gap-1 font-medium">
                                                    <Clipboard size={12} /> Whiteboard
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => handleOpenBookingModal(venue)}
                                            disabled={venue.availabilityStatus !== 'AVAILABLE'}
                                            className={`w-full ${
                                                venue.availabilityStatus === 'AVAILABLE'
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <Calendar size={16} className="mr-2" />
                                            {venue.availabilityStatus === 'AVAILABLE' ? 'Book Venue' : 'Not Available'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
                <div>
                    {myBookings.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
                            <p className="text-gray-600 mb-6">You haven't made any venue bookings</p>
                            <Button onClick={() => setActiveTab('venues')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Browse Venues
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myBookings.map((booking) => (
                                <div key={booking.bookingId} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                {booking.venue?.name || 'Venue'}
                                            </h3>
                                            <p className="text-gray-600 text-sm flex items-center">
                                                <MapPin size={14} className="mr-1" />
                                                {booking.venue?.location || 'Location'}
                                            </p>
                                        </div>
                                        {getStatusBadge(booking.approvalStatus || booking.status)}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Event</p>
                                            <p className="text-gray-800 font-medium">{booking.event?.title || booking.event?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Capacity</p>
                                            <p className="text-gray-800 font-medium">{booking.venue?.capacity || 'N/A'} people</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Start Time</p>
                                            <p className="text-gray-800 font-medium">
                                                {new Date(booking.startTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">End Time</p>
                                            <p className="text-gray-800 font-medium">
                                                {new Date(booking.endTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {booking.specialRequirements && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-1">Special Requirements</p>
                                            <p className="text-gray-800">{booking.specialRequirements}</p>
                                        </div>
                                    )}

                                    {booking.rejectionReason && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-700">
                                                <strong>Rejection Reason:</strong> {booking.rejectionReason}
                                            </p>
                                        </div>
                                    )}

                                    {(booking.approvalStatus === 'PENDING' || booking.status === 'PENDING') && (
                                        <Button
                                            onClick={() => handleCancelBooking(booking.bookingId)}
                                            disabled={submitting}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <X size={16} className="mr-2" />
                                            Cancel Booking
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedVenue && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Book {selectedVenue.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    <MapPin size={14} className="inline mr-1" />
                                    {selectedVenue.location}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseBookingModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitBooking} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
                                    <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* Event Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Event <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={bookingData.eventId}
                                    onChange={(e) => setBookingData({ ...bookingData, eventId: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                                >
                                    <option value="">-- Select an event --</option>
                                    {myEvents.map(event => (
                                        <option key={event.eventId} value={event.eventId}>
                                            {event.title || event.name}
                                        </option>
                                    ))}
                                </select>
                                {myEvents.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">
                                        ⚠️ You need to create an event first before booking a venue
                                    </p>
                                )}
                            </div>

                            {/* Start Time */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="datetime-local"
                                    min={new Date().toISOString().slice(0, 16)}
                                    value={bookingData.startTime}
                                    onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                                />
                            </div>

                            {/* End Time */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="datetime-local"
                                    min={bookingData.startTime || new Date().toISOString().slice(0, 16)}
                                    value={bookingData.endTime}
                                    onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                                />
                            </div>

                            {/* Special Requirements */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Special Requirements (Optional)
                                </label>
                                <textarea
                                    rows={4}
                                    value={bookingData.specialRequirements}
                                    onChange={(e) => setBookingData({ ...bookingData, specialRequirements: e.target.value })}
                                    placeholder="Any special setup or requirements..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 resize-none"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={handleCloseBookingModal}
                                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={submitting || myEvents.length === 0} 
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Booking Request'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenueBooking;