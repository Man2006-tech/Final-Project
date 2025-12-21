import { useState, useEffect, useContext } from 'react';
import { venueAPI, venueBookingAPI, eventAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Users, Monitor, Volume2, Clipboard, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, X } from 'lucide-react';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center';
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const VenueBooking = () => {
    const { user } = useContext(AuthContext);
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
            // Filter to only user's created events
            const allEvents = response.data?.content || response.data || [];
            const userEvents = allEvents.filter(event => event.createdBy?.userId === user.userId);
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

        if (new Date(bookingData.endTime) <= new Date(bookingData.startTime)) {
            setError('End time must be after start time');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const booking = {
                startTime: new Date(bookingData.startTime).toISOString(),
                endTime: new Date(bookingData.endTime).toISOString(),
                specialRequirements: bookingData.specialRequirements,
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
            const errorMsg = err.response?.data?.message || err.response?.data || 'Failed to create booking';
            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
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
        if (filterAmenities.projector && !venue.hasProjector) return false;
        if (filterAmenities.audio && !venue.hasAudioSystem) return false;
        if (filterAmenities.whiteboard && !venue.hasWhiteboard) return false;
        return true;
    });

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} /> },
            APPROVED: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} /> },
            REJECTED: { color: 'bg-red-100 text-red-800', icon: <XCircle size={14} /> },
        };
        const badge = badges[status] || badges.PENDING;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badge.color}`}>
                {badge.icon}
                {status}
            </span>
        );
    };

    const getAvailabilityBadge = (status) => {
        const badges = {
            AVAILABLE: 'bg-green-100 text-green-800',
            OCCUPIED: 'bg-red-100 text-red-800',
            UNDER_MAINTENANCE: 'bg-orange-100 text-orange-800',
            UNAVAILABLE: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || badges.UNAVAILABLE}`}>
                {status?.replace(/_/g, ' ')}
            </span>
        );
    };

    if (loading && venues.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading venues...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Venue Booking</h1>
                    <p className="text-gray-600">Book venues for your events and activities</p>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                        <CheckCircle size={20} className="mr-2" />
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <AlertCircle size={20} className="mr-2" />
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('venues')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'venues'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Available Venues
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'bookings'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        My Bookings {myBookings.length > 0 && `(${myBookings.length})`}
                    </button>
                </div>

                {/* Venues Tab */}
                {activeTab === 'venues' && (
                    <div>
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Amenities</h3>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterAmenities.projector}
                                        onChange={(e) => setFilterAmenities({ ...filterAmenities, projector: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Monitor size={18} className="text-gray-600" />
                                    <span className="text-gray-700">Projector</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterAmenities.audio}
                                        onChange={(e) => setFilterAmenities({ ...filterAmenities, audio: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Volume2 size={18} className="text-gray-600" />
                                    <span className="text-gray-700">Audio System</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterAmenities.whiteboard}
                                        onChange={(e) => setFilterAmenities({ ...filterAmenities, whiteboard: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Clipboard size={18} className="text-gray-600" />
                                    <span className="text-gray-700">Whiteboard</span>
                                </label>
                            </div>
                        </div>

                        {/* Venues Grid */}
                        {filteredVenues.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 text-lg">No venues found matching your filters</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredVenues.map((venue) => (
                                    <div key={venue.venueId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
                                                    <MapPin size={16} className="mr-2" />
                                                    <span className="text-sm">{venue.location}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Users size={16} className="mr-2" />
                                                    <span className="text-sm">Capacity: {venue.capacity}</span>
                                                </div>
                                            </div>

                                            {venue.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{venue.description}</p>
                                            )}

                                            {/* Amenities */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {venue.hasProjector && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
                                                        <Monitor size={12} /> Projector
                                                    </span>
                                                )}
                                                {venue.hasAudioSystem && (
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs flex items-center gap-1">
                                                        <Volume2 size={12} /> Audio
                                                    </span>
                                                )}
                                                {venue.hasWhiteboard && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                                                        <Clipboard size={12} /> Whiteboard
                                                    </span>
                                                )}
                                            </div>

                                            <Button
                                                onClick={() => handleOpenBookingModal(venue)}
                                                disabled={venue.availabilityStatus !== 'AVAILABLE'}
                                                className="w-full"
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
                                <p className="text-gray-600 text-lg">You haven't made any bookings yet</p>
                                <Button onClick={() => setActiveTab('venues')} className="mt-4">
                                    Browse Venues
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myBookings.map((booking) => (
                                    <div key={booking.bookingId} className="bg-white rounded-xl shadow-md p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                    {booking.venue?.name || 'Venue'}
                                                </h3>
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    <MapPin size={14} className="mr-1" />
                                                    {booking.venue?.location}
                                                </p>
                                            </div>
                                            {getStatusBadge(booking.approvalStatus)}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Event</p>
                                                <p className="text-gray-800 font-medium">{booking.event?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Capacity</p>
                                                <p className="text-gray-800 font-medium">{booking.venue?.capacity} people</p>
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

                                        {booking.approvalStatus === 'PENDING' && (
                                            <Button
                                                variant="danger"
                                                onClick={() => handleCancelBooking(booking.bookingId)}
                                                disabled={submitting}
                                                className="w-full md:w-auto"
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Book {selectedVenue.name}</h2>
                                <button
                                    onClick={handleCloseBookingModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitBooking} className="p-6">
                                {error && (
                                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                        <AlertCircle size={20} className="mr-2" />
                                        {error}
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                                    >
                                        <option value="">-- Select an event --</option>
                                        {myEvents.map(event => (
                                            <option key={event.eventId} value={event.eventId}>
                                                {event.name}
                                            </option>
                                        ))}
                                    </select>
                                    {myEvents.length === 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            You need to create an event first before booking a venue
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3">
                                    <Button type="submit" disabled={submitting || myEvents.length === 0} className="flex-1">
                                        {submitting ? 'Submitting...' : 'Submit Booking Request'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseBookingModal}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VenueBooking;
