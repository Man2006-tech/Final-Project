import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Ticket, Star, Heart, CreditCard, Upload, CheckCircle, X, ChevronRight, AlertTriangle, Image as ImageIcon, Briefcase } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { eventAPI, clubAPI, venueAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming'); // upcoming, past, all
    const [clubs, setClubs] = useState([]); // Store available clubs
    const [venues, setVenues] = useState([]); // Store available venues

    // Registration Modal State
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [registering, setRegistering] = useState(false);
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState(false);

    // Create Event Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [createData, setCreateData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        venueName: '',
        maxAttendees: 100,
        ticketPrice: 0,
        eventImageUrl: '',
        clubId: '', // Added clubId
        venueId: '', // Added venueId
        isPublic: true,
        hasTickets: false,
        requiresRegistration: true
    });

    // Create Club Modal State
    const [showCreateClubModal, setShowCreateClubModal] = useState(false);
    const [creatingClub, setCreatingClub] = useState(false);
    const [createClubError, setCreateClubError] = useState('');
    const [createClubSuccess, setCreateClubSuccess] = useState(false);
    const [clubData, setClubData] = useState({
        name: '',
        description: '',
        category: 'ACADEMIC', // ACADEMIC, CULTURAL, SPORTS
        logoUrl: '',
        coverImageUrl: '',
        contactEmail: ''
    });

    // Registration Form Data
    const [regData, setRegData] = useState({
        name: '',
        email: '',
        cmsId: '',
        department: '',
        year: '',
        paymentMethod: 'easypaisa', // easypaisa, jazzcash, bank
        transactionId: ''
    });

    useEffect(() => {
        fetchEvents();
        fetchClubs();
        fetchVenues();
    }, []);

    // Set initial user data when modal opens
    useEffect(() => {
        if (showRegisterModal && user) {
            setRegData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                department: user.department || ''
            }));
        }
    }, [showRegisterModal, user]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventAPI.getAllEvents();
            // Ensure we handle Page object or List depending on backend response
            const allEvents = response.data.content || response.data;
            // Sort by Date Descending
            const sorted = Array.isArray(allEvents)
                ? allEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                : [];
            setEvents(sorted);
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClubs = async () => {
        try {
            const response = await clubAPI.getAllClubs();
            setClubs(response.data);
            // Set default club if available AND no club currently selected
            if (response.data.length > 0 && !createData.clubId) {
                setCreateData(prev => ({ ...prev, clubId: response.data[0].clubId }));
            }
        } catch (err) {
            console.error("Failed to fetch clubs", err);
        }
    };

    const fetchVenues = async () => {
        try {
            const response = await venueAPI.getAllVenues();
            setVenues(response.data || []);
        } catch (err) {
            console.error("Failed to fetch venues", err);
        }
    };

    const getFilteredEvents = () => {
        const now = new Date();
        return events.filter(event => {
            const eventDate = new Date(event.startTime);
            if (filter === 'upcoming') return eventDate >= now;
            if (filter === 'past') return eventDate < now;
            return true;
        });
    };

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setShowRegisterModal(true);
        setStep(1);
        setRegSuccess(false);
        setRegError('');
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setRegistering(true);
        setRegError('');

        try {
            // Simulate Payment Verification
            if (selectedEvent.ticketPrice > 0 && regData.transactionId.length < 5) {
                throw new Error("Invalid Transaction ID");
            }

            // Call Backend API
            await eventAPI.registerForEvent(selectedEvent.eventId, user.userId);

            setRegSuccess(true);
            fetchEvents(); // Refresh lists
            setTimeout(() => {
                setShowRegisterModal(false);
                setRegSuccess(false);
            }, 2000); // Close after 2 seconds
        } catch (err) {
            setRegError(err.response?.data?.message || err.message || "Registration failed");
            setRegistering(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setCreating(true);
        setCreateError('');

        if (!createData.clubId) {
            setCreateError("Please select a club/organization");
            setCreating(false);
            return;
        }

        try {
            // Format dates for backend: LocalDateTime expects 'yyyy-MM-ddTHH:mm:ss'
            const formattedStart = createData.startTime + ":00";
            const formattedEnd = createData.endTime + ":00";

            const payload = {
                ...createData,
                startTime: formattedStart,
                endTime: formattedEnd,
                hasTickets: createData.ticketPrice > 0,
                // Add default image if empty
                eventImageUrl: createData.eventImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070'
            };

            await eventAPI.createEvent(user.userId, payload);

            setCreateSuccess(true);
            fetchEvents();
            setTimeout(() => {
                setShowCreateModal(false);
                setCreateSuccess(false);
                setCreating(false);
                setCreateData({
                    title: '', description: '', startTime: '', endTime: '',
                    venueName: '', maxAttendees: 100, ticketPrice: 0, eventImageUrl: '',
                    isPublic: true, hasTickets: false, requiresRegistration: true,
                    clubId: clubs.length > 0 ? clubs[0].clubId : '',
                    venueId: ''
                });
            }, 2000);

        } catch (err) {
            console.error(err);
            setCreateError(err.response?.data?.message || err.message || "Failed to create event");
            setCreating(false);
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();
        setCreatingClub(true);
        setCreateClubError('');

        try {
            const payload = { ...clubData };
            const response = await clubAPI.createClub(user.userId, payload);

            setCreateClubSuccess(true);
            await fetchClubs(); // Refresh clubs list

            // Auto-select the new club
            if (response.data && response.data.clubId) {
                setCreateData(prev => ({ ...prev, clubId: response.data.clubId }));
            }

            setTimeout(() => {
                setShowCreateClubModal(false);
                setCreateClubSuccess(false);
                setCreatingClub(false);
                setClubData({ name: '', description: '', category: 'ACADEMIC', logoUrl: '', coverImageUrl: '', contactEmail: '' });
            }, 1000);
        } catch (err) {
            console.error(err);
            setCreateClubError(err.response?.data?.message || err.message || "Failed to create club");
            setCreatingClub(false);
        }
    };

    const getCategoryColor = (category) => {
        const lowerCat = category?.toLowerCase() || '';
        if (lowerCat.includes('tech')) return 'from-blue-500 to-indigo-600';
        if (lowerCat.includes('sport')) return 'from-green-500 to-emerald-600';
        if (lowerCat.includes('culture') || lowerCat.includes('art')) return 'from-purple-500 to-pink-600';
        return 'from-gray-500 to-gray-600';
    };

    const getPaymentInfo = () => {
        switch (regData.paymentMethod) {
            case 'easypaisa':
                return { title: 'EasyPaisa', number: '0300-1234567', name: 'NUST Connect Events' };
            case 'jazzcash':
                return { title: 'JazzCash', number: '0321-7654321', name: 'NUST Connect Events' };
            case 'bank':
                return { title: 'HBL', number: '1234-5678-9012-3456', name: 'NUST Connect' };
            default:
                return { title: '', number: '', name: '' };
        }
    };

    const canCreateEvent = user?.role === 'ADMIN' || user?.role === 'FACULTY';

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Calendar className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Campus Events</h1>
                        </div>
                        <p className="text-purple-50 text-lg">Discover, register, and never miss an event</p>
                    </div>

                    {/* Admin Only Create Button */}
                    {canCreateEvent && (
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-none"
                            >
                                <Plus size={20} className="mr-2" />
                                Create Event
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-md w-fit">
                {['upcoming', 'past', 'all'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 capitalize ${filter === tab
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
            ) : getFilteredEvents().length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                    <p className="text-gray-500">Check back later for new updates!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredEvents().map((event) => (
                        <Card
                            key={event.eventId}
                            hoverable
                            className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group p-0 flex flex-col h-full"
                        >
                            <div className={`h-48 bg-gradient-to-br ${getCategoryColor(event.title)} relative overflow-hidden flex-shrink-0`}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                {event.eventImageUrl ? (
                                    <img src={event.eventImageUrl} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/50">
                                        <Calendar size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/30 backdrop-blur-md shadow-lg">
                                        {event.club?.name || 'General'}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-2xl font-bold">{new Date(event.startTime).getDate()}</p>
                                    <p className="text-sm font-medium uppercase">{new Date(event.startTime).toLocaleString('default', { month: 'short' })}</p>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                                    {event.title}
                                </h3>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock size={16} className="mr-2 text-purple-600 flex-shrink-0" />
                                        <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin size={16} className="mr-2 text-purple-600 flex-shrink-0" />
                                        <span className="truncate">{event.venueName || 'To be announced'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Ticket size={16} className="mr-2 text-purple-600 flex-shrink-0" />
                                        <span className="font-medium text-green-600">PKR {event.ticketPrice > 0 ? event.ticketPrice : 'Free'}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleRegisterClick(event)}
                                    disabled={new Date(event.startTime) < new Date()}
                                    className={`w-full ${new Date(event.startTime) < new Date()
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                        }`}
                                >
                                    {new Date(event.startTime) < new Date() ? 'Event Ended' : 'Register Now'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                                <p className="text-sm text-gray-500">Provide details for the new campus event</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {createSuccess ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={40} className="text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Event Created!</h3>
                                    <p className="text-gray-600">Your event has been successfully published.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateEvent} className="space-y-6">
                                    {createError && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                                            <AlertTriangle size={16} className="mr-2" />
                                            {createError}
                                        </div>
                                    )}

                                    {/* Club Selection */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Organizing Club</label>
                                        <div className="flex space-x-2">
                                            <select
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                value={createData.clubId}
                                                onChange={(e) => setCreateData({ ...createData, clubId: e.target.value })}
                                            >
                                                <option value="">Select a Club</option>
                                                {clubs.map(club => (
                                                    <option key={club.clubId} value={club.clubId}>
                                                        {club.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowCreateClubModal(true)}
                                                className="flex-shrink-0"
                                                title="Create New Club"
                                            >
                                                <Plus size={18} />
                                            </Button>
                                        </div>
                                        {clubs.length === 0 && <p className="text-xs text-red-500 mt-1">No clubs found. Create one using the + button.</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Event Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                value={createData.title}
                                                onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                                            />
                                        </div>

                                        {/* Venue Selection */}
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Venue</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <select
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    value={createData.venueId}
                                                    onChange={(e) => {
                                                        const selectedVenue = venues.find(v => v.venueId === parseInt(e.target.value));
                                                        setCreateData({
                                                            ...createData,
                                                            venueId: e.target.value,
                                                            venueName: selectedVenue ? selectedVenue.name : createData.venueName
                                                        });
                                                    }}
                                                >
                                                    <option value="">Select a Venue (Optional)</option>
                                                    {venues.map(venue => (
                                                        <option key={venue.venueId} value={venue.venueId}>
                                                            {venue.name} ({venue.capacity} cap)
                                                        </option>
                                                    ))}
                                                    <option value="other">Other / TBD</option>
                                                </select>

                                                {(!createData.venueId || createData.venueId === 'other') && (
                                                    <input
                                                        type="text"
                                                        placeholder="Or enter location manually"
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                        value={createData.venueName}
                                                        onChange={(e) => setCreateData({ ...createData, venueName: e.target.value })}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                value={createData.description}
                                                onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Start Time</label>
                                                <input
                                                    type="datetime-local"
                                                    required
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    value={createData.startTime}
                                                    onChange={(e) => setCreateData({ ...createData, startTime: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">End Time</label>
                                                <input
                                                    type="datetime-local"
                                                    required
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    value={createData.endTime}
                                                    onChange={(e) => setCreateData({ ...createData, endTime: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Max Attendees</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    value={createData.maxAttendees}
                                                    onChange={(e) => setCreateData({ ...createData, maxAttendees: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Ticket Price (PKR)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    value={createData.ticketPrice}
                                                    onChange={(e) => setCreateData({ ...createData, ticketPrice: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Banner Image URL</label>
                                            <div className="flex">
                                                <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 flex items-center">
                                                    <ImageIcon size={18} className="text-gray-500" />
                                                </div>
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    className="w-full px-4 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    value={createData.eventImageUrl}
                                                    onChange={(e) => setCreateData({ ...createData, eventImageUrl: e.target.value })}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500">Leave empty for a random default image.</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                        <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            loading={creating}
                                            className="bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                            Create Event
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Club Modal (Nested/Separate) */}
            {showCreateClubModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Create New Club</h2>
                                <p className="text-sm text-gray-500">Register a new student organization</p>
                            </div>
                            <button onClick={() => setShowCreateClubModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {createClubSuccess ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle size={32} className="text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Club Created!</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateClub} className="space-y-4">
                                    {createClubError && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                                            <AlertTriangle size={16} className="mr-2" />
                                            {createClubError}
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Club Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={clubData.name}
                                            onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            required
                                            rows={2}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={clubData.description}
                                            onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={clubData.category}
                                            onChange={(e) => setClubData({ ...clubData, category: e.target.value })}
                                        >
                                            <option value="ACADEMIC">Academic</option>
                                            <option value="CULTURAL">Cultural</option>
                                            <option value="SPORTS">Sports</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Contact Email</label>
                                        <input
                                            type="email"
                                            placeholder="club@nust.edu.pk"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={clubData.contactEmail}
                                            onChange={(e) => setClubData({ ...clubData, contactEmail: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setShowCreateClubModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            loading={creatingClub}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Create Club
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            {showRegisterModal && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                                <p className="text-sm text-gray-500">Registration</p>
                            </div>
                            <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            {regSuccess ? (
                                <div className="text-center py-8 animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={40} className="text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                                    <p className="text-gray-600">You have been registered for the event.</p>
                                </div>
                            ) : (
                                <form onSubmit={step === 1 ? handleNextStep : handleRegistrationSubmit} className="space-y-6">
                                    {/* Progress Steps */}
                                    <div className="flex items-center justify-center space-x-4 mb-6">
                                        <div className={`flex items-center space-x-2 ${step === 1 ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>1</div>
                                            <span>Details</span>
                                        </div>
                                        <div className="w-12 h-0.5 bg-gray-200"></div>
                                        <div className={`flex items-center space-x-2 ${step === 2 ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>2</div>
                                            <span>Payment</span>
                                        </div>
                                    </div>

                                    {regError && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                                            <AlertTriangle size={16} className="mr-2" />
                                            {regError}
                                        </div>
                                    )}

                                    {step === 1 ? (
                                        // Step 1: User Details
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                        value={regData.name}
                                                        onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700">CMS ID</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 123456"
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                        value={regData.cmsId}
                                                        onChange={(e) => setRegData({ ...regData, cmsId: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Email (Official)</label>
                                                <input
                                                    type="email"
                                                    required
                                                    readOnly
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                    value={regData.email}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700">Department</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                        value={regData.department}
                                                        onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700">Year / Batch</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 2022"
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                        value={regData.year}
                                                        onChange={(e) => setRegData({ ...regData, year: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Step 2: Payment
                                        <div className="space-y-6">
                                            {selectedEvent.ticketPrice > 0 ? (
                                                <>
                                                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex justify-between items-center">
                                                        <span className="font-medium text-purple-900">Total Amount</span>
                                                        <span className="text-2xl font-bold text-purple-700">PKR {selectedEvent.ticketPrice}</span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-sm font-medium text-gray-700">Payment Method</label>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {['easypaisa', 'jazzcash', 'bank'].map(method => (
                                                                <button
                                                                    key={method}
                                                                    type="button"
                                                                    onClick={() => setRegData({ ...regData, paymentMethod: method })}
                                                                    className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${regData.paymentMethod === method
                                                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                                        }`}
                                                                >
                                                                    {method}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Send Payment To:</p>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-semibold text-gray-900">{getPaymentInfo().title}</span>
                                                            <span className="font-mono text-gray-600">{getPaymentInfo().number}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">{getPaymentInfo().name}</p>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-sm font-medium text-gray-700">Transaction ID / Reference No.</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Enter Trx ID from SMS/App"
                                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                                            value={regData.transactionId}
                                                            onChange={(e) => setRegData({ ...regData, transactionId: e.target.value })}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Ticket size={48} className="mx-auto text-green-500 mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900">This event is Free!</h3>
                                                    <p className="text-gray-500">No payment required. Click Register to confirm your spot.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                        {step === 2 && (
                                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                                                Back
                                            </Button>
                                        )}
                                        {step === 1 ? (
                                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                                                Next: Payment
                                                <ChevronRight size={16} className="ml-1" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                loading={registering}
                                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                                            >
                                                Confirm Registration
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;