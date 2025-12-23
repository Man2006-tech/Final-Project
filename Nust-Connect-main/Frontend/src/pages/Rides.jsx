import { useState, useEffect } from 'react';
import { Car, MapPin, Users, Clock, Plus, Filter, Navigation, DollarSign, X, MessageCircle, AlertTriangle, Check, XCircle, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { rideAPI, messageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Rides = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState('available'); // available, myRides, myRequests
    const [creating, setCreating] = useState(false);
    const [requesting, setRequesting] = useState(null);
    const [requestedRides, setRequestedRides] = useState(new Set()); // Track rides user has requested
    const [myRequests, setMyRequests] = useState([]); // User's ride requests
    const [rideRequests, setRideRequests] = useState({}); // Requests for driver's rides {rideId: [requests]}
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        pickupLocation: '',
        destination: '',
        departureTime: '',
        availableSeats: 3,
        pricePerSeat: '',
        isNegotiable: false,
        notes: '',
        contactNumber: ''
    });

    useEffect(() => {
        fetchRides();
        if (user?.userId) {
            fetchMyRequests();
        }
    }, [activeTab, user?.userId]);

    const fetchRides = async () => {
        try {
            setLoading(true);
            const response = await rideAPI.getAllRides();
            const allRides = response.data;

            if (activeTab === 'myRides') {
                const myRides = allRides.filter(r => r.driver.userId === user?.userId);
                setRides(myRides);
                // Fetch requests for each of driver's rides
                await fetchRequestsForMyRides(myRides);
            } else if (activeTab === 'myRequests') {
                setRides([]);
            } else {
                setRides(allRides.filter(r => r.status === 'ACTIVE'));
            }
        } catch (err) {
            console.error("Failed to fetch rides", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRequests = async () => {
        try {
            const response = await rideAPI.getPassengerRequests(user.userId);
            setMyRequests(response.data);
            // Mark rides as requested
            const requestedRideIds = new Set(response.data.map(req => req.ride.rideId));
            setRequestedRides(requestedRideIds);
        } catch (err) {
            console.error("Failed to fetch my requests", err);
        }
    };

    const fetchRequestsForMyRides = async (myRides) => {
        try {
            const requestsMap = {};
            await Promise.all(myRides.map(async (ride) => {
                const response = await rideAPI.getRideRequests(ride.rideId);
                requestsMap[ride.rideId] = response.data;
            }));
            setRideRequests(requestsMap);
        } catch (err) {
            console.error("Failed to fetch ride requests", err);
        }
    };

    const handleCreateRide = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');

        try {
            // Include negotiation note if checked
            const notes = formData.isNegotiable
                ? `(Price Negotiable) ${formData.notes}`
                : formData.notes;

            await rideAPI.createRide(user.userId, {
                ...formData,
                notes,
                // Send raw datetime-local value with seconds appended for LocalDateTime compatibility
                departureTime: formData.departureTime + ":00"
            });
            setShowCreateModal(false);
            fetchRides();
            setFormData({
                pickupLocation: '',
                destination: '',
                departureTime: '',
                availableSeats: 3,
                pricePerSeat: '',
                isNegotiable: false,
                notes: '',
                contactNumber: ''
            });
        } catch (err) {
            console.error(err);
            const detailedError = err.response?.data?.message ||
                err.response?.data?.error ||
                JSON.stringify(err.response?.data) ||
                err.message ||
                'Failed to create ride';
            setError(detailedError);
        } finally {
            setCreating(false);
        }
    };

    const handleCancelRide = async (rideId) => {
        if (!window.confirm("Are you sure you want to cancel this ride?")) return;
        try {
            await rideAPI.cancelRide(rideId);
            setSuccessMessage('Ride cancelled successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchRides();
        } catch (err) {
            console.error("Failed to cancel ride", err);
            setError(err.response?.data?.message || "Failed to cancel ride");
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRequestRide = async (rideId) => {
        if (!user) {
            setError('You must be logged in to request a ride');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setRequesting(rideId);
        setError('');
        setSuccessMessage('');

        try {
            await rideAPI.requestRide(rideId, user.userId);
            setRequestedRides(prev => new Set([...prev, rideId])); // Mark as requested
            setSuccessMessage('Ride request sent successfully! The driver will be notified.');
            setTimeout(() => setSuccessMessage(''), 5000);
            fetchRides();
        } catch (err) {
            console.error("Failed to request ride", err);
            const errorMsg = err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to request ride";

            // If already requested, add to set
            if (errorMsg.toLowerCase().includes('already') || errorMsg.toLowerCase().includes('duplicate')) {
                setRequestedRides(prev => new Set([...prev, rideId]));
            }

            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
        } finally {
            setRequesting(null);
        }
    };

    const handleMessageDriver = (driver) => {
        navigate('/messages', { state: { selectedUser: driver } });
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await rideAPI.acceptRequest(requestId);
            setSuccessMessage('Request accepted! Seats have been allocated.');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchRides(); // Refresh to update seat count
            if (activeTab === 'myRides') {
                const myRides = rides;
                await fetchRequestsForMyRides(myRides);
            }
        } catch (err) {
            console.error("Failed to accept request", err);
            setError(err.response?.data?.message || "Failed to accept request");
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rideAPI.rejectRequest(requestId);
            setSuccessMessage('Request rejected.');
            setTimeout(() => setSuccessMessage(''), 3000);
            if (activeTab === 'myRides') {
                const myRides = rides;
                await fetchRequestsForMyRides(myRides);
            }
        } catch (err) {
            console.error("Failed to reject request", err);
            setError(err.response?.data?.message || "Failed to reject request");
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCancelMyRequest = async (rideId) => {
        try {
            // Find the request for this ride
            const request = myRequests.find(req => req.ride.rideId === rideId);
            if (request) {
                await rideAPI.deleteRequest(request.requestId);
                setSuccessMessage('Request cancelled successfully.');
                setTimeout(() => setSuccessMessage(''), 3000);
                // Remove from requested rides set
                setRequestedRides(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(rideId);
                    return newSet;
                });
                // Refresh requests
                await fetchMyRequests();
            }
        } catch (err) {
            console.error("Failed to cancel request", err);
            setError(err.response?.data?.message || "Failed to cancel request");
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Success Message */}
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top flex items-center">
                    <AlertTriangle size={18} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Car className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Ride Sharing</h1>
                        </div>
                        <p className="text-blue-50 text-lg">Share rides, save money, make friends</p>
                    </div>

                    {/* FIXED: Green Offer Ride Button */}
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-500 hover:bg-green-600 text-white shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border-none"
                    >
                        <Plus size={20} className="mr-2" />
                        Offer a Ride
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-md">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'available'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Available Rides
                    </button>
                    <button
                        onClick={() => setActiveTab('myRides')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'myRides'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        My Rides
                    </button>
                    <button
                        onClick={() => setActiveTab('myRequests')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === 'myRequests'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        My Requests
                    </button>
                </div>

                <Button variant="outline" className="flex items-center space-x-2">
                    <Filter size={18} />
                    <span>Filter</span>
                </Button>
            </div>

            {/* Rides Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading rides...</p>
                </div>
            ) : rides.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Car size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No rides found</h3>
                    <p className="text-gray-500">Be the first to offer a ride!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {rides.map((ride) => {
                        const isOwner = ride.driver.userId === user?.userId;
                        const isNegotiable = ride.notes?.toLowerCase().includes("negotiable");

                        return (
                            <Card
                                key={ride.rideId}
                                hoverable
                                className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Driver Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {ride.driver.profilePicture ? (
                                                <img src={ride.driver.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                ride.driver.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </div>

                                    {/* Ride Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">
                                                    {ride.driver.name}
                                                    {isOwner && <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-sm text-gray-500">{new Date(ride.departureTime).toLocaleDateString()}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{ride.status}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end space-x-1 text-blue-600 font-bold text-xl">
                                                    <span>Rs {ride.pricePerSeat}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">per seat</p>
                                                {isNegotiable && <span className="text-[10px] text-green-600 font-bold uppercase">Negotiable</span>}
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="mb-4 relative">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-200"></div>
                                                    <div className="w-0.5 h-8 bg-gradient-to-b from-green-500 to-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-200"></div>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin size={16} className="text-green-600" />
                                                        <span className="font-medium text-gray-900 truncate">{ride.pickupLocation}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Navigation size={16} className="text-red-600" />
                                                        <span className="font-medium text-gray-900 truncate">{ride.destination}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Info & Actions */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Clock size={16} />
                                                    <span>{new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users size={16} />
                                                    <span>{ride.availableSeats} seats</span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                {!isOwner && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-gray-600 hover:text-blue-600"
                                                        onClick={() => handleMessageDriver(ride.driver)}
                                                    >
                                                        <MessageCircle size={18} />
                                                    </Button>
                                                )}

                                                {isOwner ? (
                                                    ride.status !== 'CANCELLED' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                                                            onClick={() => handleCancelRide(ride.rideId)}
                                                        >
                                                            Cancel Ride
                                                        </Button>
                                                    )
                                                ) : requestedRides.has(ride.rideId) ? (
                                                    <Button
                                                        size="sm"
                                                        className="bg-gray-400 cursor-not-allowed text-white"
                                                        disabled={true}
                                                    >
                                                        Requested
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        onClick={() => handleRequestRide(ride.rideId)}
                                                        loading={requesting === ride.rideId}
                                                        disabled={requesting === ride.rideId}
                                                    >
                                                        {requesting === ride.rideId ? 'Requesting...' : 'Request'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ride Requests Section for Driver */}
                                {isOwner && activeTab === 'myRides' && rideRequests[ride.rideId]?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                                            <Inbox size={16} className="mr-2" />
                                            Ride Requests ({rideRequests[ride.rideId].length})
                                        </h4>
                                        <div className="space-y-2">
                                            {rideRequests[ride.rideId].map((request) => (
                                                <div key={request.requestId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                            {request.passenger.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{request.passenger.name}</p>
                                                            <p className="text-xs text-gray-500">{request.seatsRequested} seat(s) • {request.message || 'No message'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {request.status === 'PENDING' ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                                    onClick={() => handleAcceptRequest(request.requestId)}
                                                                >
                                                                    <Check size={14} />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                                    onClick={() => handleRejectRequest(request.requestId)}
                                                                >
                                                                    <XCircle size={14} />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                                request.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                                request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {request.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* My Requests Tab Content */}
            {activeTab === 'myRequests' && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading your requests...</p>
                        </div>
                    ) : myRequests.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No ride requests</h3>
                            <p className="text-gray-500">You haven't requested any rides yet</p>
                        </div>
                    ) : (
                        myRequests.map((request) => (
                            <Card key={request.requestId} className="border-none shadow-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {request.ride.pickupLocation} → {request.ride.destination}
                                            </h3>
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                request.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p><strong>Driver:</strong> {request.ride.driver.name}</p>
                                            <p><strong>Departure:</strong> {new Date(request.ride.departureTime).toLocaleString()}</p>
                                            <p><strong>Seats Requested:</strong> {request.seatsRequested}</p>
                                            {request.message && <p><strong>Message:</strong> {request.message}</p>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        {request.status === 'ACCEPTED' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-600 hover:text-blue-700"
                                                onClick={() => handleMessageDriver(request.ride.driver)}
                                            >
                                                <MessageCircle size={18} className="mr-1" />
                                                Message Driver
                                            </Button>
                                        )}
                                        {request.status === 'PENDING' && (
                                            <Button
                                                size="sm"
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => handleCancelMyRequest(request.ride.rideId)}
                                            >
                                                Cancel Request
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Create Ride Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden relative">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Offer a Ride</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateRide} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                                    <AlertTriangle size={16} className="mr-2" />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Pickup Location</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. NUST H-12"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.pickupLocation}
                                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Destination</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Saddar"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Departure Time</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.departureTime}
                                        onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Available Seats</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="6"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.availableSeats}
                                        onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Price per Seat (PKR)</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 500"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.pricePerSeat}
                                        onChange={(e) => setFormData({ ...formData, pricePerSeat: e.target.value })}
                                    />
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            checked={formData.isNegotiable}
                                            onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                                        />
                                        <span className="text-sm text-gray-600">Negotiable</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Contact / Notes</label>
                                <textarea
                                    placeholder="Any specific meeting point or rules?"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" loading={creating} className="bg-green-600 hover:bg-green-700">
                                    Create Ride
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rides;
