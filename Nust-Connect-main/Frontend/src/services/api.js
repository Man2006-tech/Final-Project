import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - logout user
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) =>
        api.post('/auth/reset-password', { token, newPassword }),
    changePassword: (userId, passwords) =>
        api.post(`/auth/change-password/${userId}`, passwords),
};

// User APIs
export const userAPI = {
    getProfile: (userId) => api.get(`/users/${userId}`),
    updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
    getAllUsers: () => api.get('/users'),
    uploadFile: (formData) => api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

// Post APIs
export const postAPI = {
    getAllPosts: (page = 0, size = 10) =>
        api.get(`/posts?page=${page}&size=${size}`),
    getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
    getPost: (postId) => api.get(`/posts/${postId}`),
    createPost: (userId, postData) =>
        api.post(`/posts?userId=${userId}`, postData),
    updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
    deletePost: (postId) => api.delete(`/posts/${postId}`),
    likePost: (postId, userId) =>
        api.post(`/posts/${postId}/like?userId=${userId}`),
    unlikePost: (postId, userId) =>
        api.delete(`/posts/${postId}/unlike?userId=${userId}`),
    getComments: (postId) => api.get(`/posts/${postId}/comments`),
    createComment: (postId, userId, content) =>
        api.post(`/posts/${postId}/comments?userId=${userId}`, { content }),
};

// Event APIs
export const eventAPI = {
    getAllEvents: (page = 0, size = 10) =>
        api.get(`/events?page=${page}&size=${size}`),
    getUpcomingEvents: () => api.get('/events/upcoming'),
    getEvent: (eventId) => api.get(`/events/${eventId}`),
    createEvent: (creatorId, eventData) =>
        api.post(`/events?creatorId=${creatorId}`, eventData),
    registerForEvent: (eventId, userId) =>
        api.post(`/events/${eventId}/register?userId=${userId}`),
    unregisterFromEvent: (eventId, userId) =>
        api.delete(`/events/${eventId}/unregister?userId=${userId}`),
    approveEvent: (eventId) => api.patch(`/events/${eventId}/approve`),
    getPendingEvents: () => api.get('/events/pending'),
    deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
};



// Ride Sharing APIs
export const rideAPI = {
    getAllRides: () => api.get('/rides'),
    getUpcomingRides: () => api.get('/rides/upcoming'),
    searchRides: (keyword) => api.get(`/rides/search?keyword=${keyword}`),
    getRide: (rideId) => api.get(`/rides/${rideId}`),
    createRide: (driverId, rideData) =>
        api.post(`/rides?driverId=${driverId}`, rideData),
    cancelRide: (rideId) => api.patch(`/rides/${rideId}/cancel`),
    deleteRide: (rideId) => api.delete(`/rides/${rideId}`),
    requestRide: (rideId, userId, requestData = { seatsRequested: 1, message: "Interested" }) =>
        api.post(`/rides/${rideId}/request?passengerId=${userId}`, requestData),
    getRideRequests: (rideId) => api.get(`/rides/${rideId}/requests`),
    getPassengerRequests: (passengerId) => api.get(`/rides/requests/passenger/${passengerId}`),
    acceptRequest: (requestId) => api.patch(`/rides/requests/${requestId}/accept`),
    rejectRequest: (requestId) => api.patch(`/rides/requests/${requestId}/reject`),
    deleteRequest: (requestId) => api.delete(`/rides/requests/${requestId}`),
};

// Lost & Found APIs
export const lostFoundAPI = {
    getLostItems: () => api.get('/lostandfound/lost'),
    getFoundItems: () => api.get('/lostandfound/found'),
    reportLostItem: (userId, itemData) =>
        api.post(`/lostandfound/lost?userId=${userId}`, itemData),
    reportFoundItem: (userId, itemData) =>
        api.post(`/lostandfound/found?userId=${userId}`, itemData),
};

// Notification APIs
export const notificationAPI = {
    getNotifications: (userId) => api.get(`/notifications/user/${userId}`),
    markAsRead: (notificationId) =>
        api.patch(`/notifications/${notificationId}/read`),
    markAllAsRead: (userId) =>
        api.patch(`/notifications/user/${userId}/read-all`),
};

// Message APIs
export const messageAPI = {
    sendMessage: (senderId, receiverId, content) =>
        api.post(`/messages/send/${receiverId}?senderId=${senderId}`, { content }),
    getConversation: (userId1, userId2) =>
        api.get(`/messages/conversation/${userId1}/${userId2}`),
    getConversationPartners: (userId) => api.get(`/messages/partners/${userId}`),
    getUnreadMessages: (userId) => api.get(`/messages/unread/${userId}`),
    markAsRead: (messageId) => api.patch(`/messages/${messageId}/read`),
    deleteConversation: (userId1, userId2) =>
        api.delete(`/messages/conversation/${userId1}/${userId2}`),
};

// Club APIs
export const clubAPI = {
    getAllClubs: () => api.get('/clubs'),
    getClub: (clubId) => api.get(`/clubs/${clubId}`),
    createClub: (creatorId, clubData) =>
        api.post(`/clubs?creatorId=${creatorId}`, clubData),
    joinClub: (clubId, userId) =>
        api.post(`/clubs/${clubId}/join?userId=${userId}`),
    leaveClub: (clubId, userId) =>
        api.delete(`/clubs/${clubId}/leave?userId=${userId}`),
    toggleRecruitment: (clubId) => api.patch(`/clubs/${clubId}/recruitment`),
    deleteClub: (clubId) => api.delete(`/clubs/${clubId}`),
};

// Marketplace APIs
export const marketplaceAPI = {
    getAllItems: (page = 0, size = 10) =>
        api.get(`/marketplace/items?page=${page}&size=${size}`),
    getItem: (itemId) => api.get(`/marketplace/items/${itemId}`),
    createItem: (sellerId, itemData) =>
        api.post(`/marketplace/items?sellerId=${sellerId}`, itemData),
    updateItem: (itemId, itemData) =>
        api.put(`/marketplace/items/${itemId}`, itemData),
    deleteItem: (itemId) => api.delete(`/marketplace/items/${itemId}`),
    getCategories: () => api.get('/marketplace/categories'),
};

// Feedback APIs
export const feedbackAPI = {
    getAllFeedback: () => api.get('/feedback'),
    getUserFeedback: (userId) => api.get(`/feedback/user/${userId}`),
    createFeedback: (userId, feedbackData) => api.post(`/feedback?userId=${userId}`, feedbackData),
    resolveFeedback: (feedbackId) => api.patch(`/feedback/${feedbackId}/resolve`),
    cancelFeedback: (feedbackId, userId) => api.patch(`/feedback/${feedbackId}/cancel?userId=${userId}`)
};

// Job Posting APIs
export const jobAPI = {
    getAllJobs: () => api.get('/jobs'),
    getJob: (jobId) => api.get(`/jobs/${jobId}`),
    searchJobs: (keyword) => api.get(`/jobs/search?keyword=${keyword}`),
    createJob: (posterId, jobData) => api.post(`/jobs?posterId=${posterId}`, jobData),
    closeJob: (jobId) => api.patch(`/jobs/${jobId}/close`),
    deleteJob: (jobId) => api.delete(`/jobs/${jobId}`)
};

// Venue APIs
export const venueAPI = {
    getAllVenues: () => api.get('/venues'),
    getVenue: (venueId) => api.get(`/venues/${venueId}`),
    getAvailableVenues: () => api.get('/venues/available'),
    getVenuesByCapacity: (minCapacity) => api.get(`/venues/capacity/${minCapacity}`),
    getVenuesWithProjector: () => api.get('/venues/amenities/projector'),
    getVenuesWithAudio: () => api.get('/venues/amenities/audio'),
    getVenuesWithWhiteboard: () => api.get('/venues/amenities/whiteboard'),
    getVenuesWithAllAmenities: () => api.get('/venues/amenities/all'),
};

// Venue Booking APIs
export const venueBookingAPI = {
    createBooking: (userId, venueId, eventId, bookingData) =>
        api.post(`/venue-bookings?userId=${userId}&venueId=${venueId}&eventId=${eventId}`, bookingData),
    getBooking: (bookingId) => api.get(`/venue-bookings/${bookingId}`),
    getUserBookings: (userId) => api.get(`/venue-bookings/user/${userId}`),
    getVenueBookings: (venueId) => api.get(`/venue-bookings/venue/${venueId}`),
    getUpcomingBookings: (venueId) => api.get(`/venue-bookings/venue/${venueId}/upcoming`),
    updateBooking: (bookingId, bookingData) =>
        api.put(`/venue-bookings/${bookingId}`, bookingData),
    cancelBooking: (bookingId) => api.delete(`/venue-bookings/${bookingId}/cancel`),
    approveBooking: (bookingId) => api.patch(`/venue-bookings/${bookingId}/approve`),
    getPendingBookings: () => api.get('/venue-bookings/pending'),
};

export default api;
