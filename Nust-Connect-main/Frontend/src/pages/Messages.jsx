import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageAPI, userAPI } from '../services/api';
import { User, Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import Button from '../components/common/Button';

const Messages = () => {
    const { user: currentUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.selectedUser) {
            startChat(location.state.selectedUser);
            // Optional: Clear state to avoid reopening on refresh? 
            // window.history.replaceState({}, document.title)
        }
    }, [location.state]);

    useEffect(() => {
        fetchConversations();
    }, [currentUser]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.userId);
            const interval = setInterval(() => fetchMessages(selectedUser.userId), 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            if (!currentUser?.userId) return;
            const response = await messageAPI.getConversationPartners(currentUser.userId);
            setConversations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch conversations', error);
            setLoading(false);
        }
    };

    const fetchMessages = async (otherUserId) => {
        try {
            const response = await messageAPI.getConversation(currentUser.userId, otherUserId);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            await messageAPI.sendMessage(currentUser.userId, selectedUser.userId, newMessage);
            setNewMessage('');
            fetchMessages(selectedUser.userId);
            fetchConversations(); // Refresh list to show latest
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const response = await userAPI.getAllUsers(); // Or use specific search endpoint if available
                // Client side filter for demo if search endpoint not optimal, 
                // but ideally: userAPI.searchUsers(query)
                // Let's try userAPI.getAllUsers for now as temporary or check if search exists
                // api.js has getAllUsers. Let's assume standard search doesn't exist yet or use getAllUsers filtering
                // Wait, Controller has searchUsers, let's check api.js again.
                // api.js: getAllUsers: () => api.get('/users')
                // UserController: @GetMapping("/search") with keyword
                // Let's use direct axios if api.js missing search, or just filter all for now (simpler if user base small)
                // Actually, let's add search to api.js if needed or just filter conversations + filtered list

                // For now, let's just filter the ALL users list to find new people
                const allUsers = await userAPI.getAllUsers();
                const filtered = allUsers.data.filter(u =>
                    u.userId !== currentUser.userId &&
                    (u.name.toLowerCase().includes(query.toLowerCase()) ||
                        u.email.toLowerCase().includes(query.toLowerCase()) ||
                        u.studentId?.toLowerCase().includes(query.toLowerCase()))
                );
                setSearchResults(filtered);
            } catch (error) {
                console.error('Search failed', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const startChat = (user) => {
        // Check if already in conversations
        const exists = conversations.find(c => c.userId === user.userId);
        if (!exists) {
            setConversations([user, ...conversations]);
        }
        setSelectedUser(user);
        setSearchQuery('');
        setSearchResults([]);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Messages</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {searchQuery.length > 0 ? (
                        <div className="p-2">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">Search Results</h3>
                            {searchResults.map(user => (
                                <div
                                    key={user.userId}
                                    onClick={() => startChat(user)}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-200 cursor-pointer"
                                >
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.studentId || user.department}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {conversations.map(user => (
                                <div
                                    key={user.userId}
                                    onClick={() => setSelectedUser(user)}
                                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedUser?.userId === user.userId ? 'bg-primary-50 border border-primary-100' : 'hover:bg-slate-200'}`}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center overflow-hidden">
                                            {user.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-600" />}
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className={`text-sm font-semibold truncate ${selectedUser?.userId === user.userId ? 'text-primary-900' : 'text-slate-800'}`}>{user.name}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                            {conversations.length === 0 && (
                                <div className="text-center py-8 text-slate-500 text-sm">
                                    No conversations yet. Search to start chatting!
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                    {selectedUser.profilePicture ? <img src={selectedUser.profilePicture} alt={selectedUser.name} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-500" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedUser.name}</h3>
                                    <p className="text-xs text-green-600 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 text-slate-400">
                                <button className="p-2 hover:bg-slate-100 rounded-full"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 rounded-full"><Video size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender.userId === currentUser.userId;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-200' : 'text-slate-400'}`}>
                                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} className="text-slate-300 ml-1" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600">Your Messages</h3>
                        <p className="text-sm">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
