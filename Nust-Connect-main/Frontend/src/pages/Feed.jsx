import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import PostCard from '../components/Feed/PostCard';
import CreatePostModal from '../components/Feed/CreatePostModal';

const Feed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:8081${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const fetchPosts = async (reset = false) => {
        try {
            const currentPage = reset ? 0 : page;
            const response = await postAPI.getAllPosts(currentPage);
            const newPosts = response.data.content;

            if (reset) {
                setPosts(newPosts);
                setPage(1);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
                setPage(prev => prev + 1);
            }

            setHasMore(!response.data.last);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch posts", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(true);
    }, []);

    const handlePostCreated = () => {
        // Refresh feed
        fetchPosts(true);
    };

    const handlePostDeleted = (postId) => {
        setPosts(prev => prev.filter(p => p.postId !== postId));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-6">
            <div className="max-w-2xl mx-auto px-4">

                {/* Header / Create Post Trigger */}
                <div className="bg-white rounded-2xl p-4 mb-6 flex items-center shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setIsCreateModalOpen(true)}>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 mr-3 overflow-hidden">
                        {user?.profilePicture ? (
                            <img src={getImageUrl(user.profilePicture)} alt="Me" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                                {user?.name?.[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-slate-500 text-sm hover:bg-slate-200 transition-colors">
                        What's on your mind, {user?.name?.split(' ')[0]}?
                    </div>
                    <button className="ml-3 p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                        <Plus size={20} />
                    </button>
                </div>

                {/* Posts List */}
                {loading && posts.length === 0 ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse shadow-sm border border-slate-200"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard key={post.postId} post={post} onPostDeleted={handlePostDeleted} />
                        ))}

                        {posts.length === 0 && (
                            <div className="text-center py-10 text-slate-500">
                                <p className="text-lg font-semibold">No posts yet</p>
                                <p className="text-sm">Be the first to share something!</p>
                            </div>
                        )}

                        {/* Load More Button - Simple implementation */}
                        {hasMore && posts.length > 0 && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => fetchPosts(false)}
                                    className="px-6 py-2 bg-white border border-slate-300 rounded-full text-slate-600 text-sm hover:bg-slate-50 shadow-sm"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                userId={user?.userId}
                onPostCreated={handlePostCreated}
            />
        </div>
    );
};

export default Feed;
