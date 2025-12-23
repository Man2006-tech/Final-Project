import { useState, useRef, useEffect } from 'react';
import { Heart, MessageSquare, Share2, MoreVertical, Send, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { postAPI } from '../../services/api';

const PostCard = ({ post, onLikeToggle, onPostDeleted }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false); // Optimistic state
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.contentText);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:8081${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const handleLike = async () => {
        if (!user) return;
        try {
            if (isLiked) {
                await postAPI.unlikePost(post.postId, user.userId);
                setLikeCount(prev => Math.max(0, prev - 1));
            } else {
                await postAPI.likePost(post.postId, user.userId);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
            if (onLikeToggle) onLikeToggle();
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const toggleComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const response = await postAPI.getComments(post.postId);
                setComments(response.data);
            } catch (error) {
                console.error("Failed to load comments", error);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            const response = await postAPI.createComment(post.postId, user.userId, newComment);
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(post.contentText);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) {
            alert("Post content cannot be empty");
            return;
        }

        try {
            await postAPI.updatePost(post.postId, { contentText: editContent });
            post.contentText = editContent; // Update local post object
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update post", error);
            alert("Failed to update post.");
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await postAPI.deletePost(post.postId);
            if (onPostDeleted) onPostDeleted(post.postId);
        } catch (error) {
            console.error("Failed to delete post", error);
            alert("Failed to delete post.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible mb-6 animate-fade-in relative z-10 transition-shadow hover:shadow-md">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-slate-50">
                        {post.author.profilePicture ? (
                            <img src={getImageUrl(post.author.profilePicture)} alt={post.author.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                                {post.author.name[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">{post.author.name}</h4>
                        <p className="text-xs text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Options Menu */}
                {user && user.userId === post.author.userId && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors">
                                    <Edit2 size={16} className="mr-2 text-blue-500" /> Edit Post
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors border-t border-slate-50"
                                >
                                    <Trash2 size={16} className="mr-2" /> Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-800"
                            rows={4}
                            placeholder="Edit your post..."
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-[15px]">{post.contentText}</p>
                )}
            </div>

            {/* Media */}
            {post.mediaUrl && (
                <div className="group relative w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => window.open(getImageUrl(post.mediaUrl), '_blank')}>
                    <img src={getImageUrl(post.mediaUrl)} alt="Post content" className="w-full h-auto max-h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
                </div>
            )}

            {/* Actions */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-b-2xl">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 transition-transform active:scale-90 ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                    >
                        <Heart size={22} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
                        <span className="font-semibold text-sm">{likeCount > 0 ? likeCount : ''}</span>
                    </button>
                    <button
                        onClick={toggleComments}
                        className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <MessageSquare size={22} />
                        <span className="font-semibold text-sm">{post.commentCount > 0 ? post.commentCount : ''}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-slate-500 hover:text-green-600 transition-colors">
                        <Share2 size={22} />
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-slate-50/50 p-4 border-t border-slate-100 backdrop-blur-sm">
                    <div className="space-y-4 mb-4">
                        {loadingComments ? (
                            <div className="flex justify-center py-4"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
                        ) : comments.length === 0 ? (
                            <div className="text-center text-slate-500 text-sm py-4 italic">No comments yet.</div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.commentId} className="flex space-x-3 group animate-in slide-in-from-top-1 duration-200">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                        {comment.author.profilePicture ? (
                                            <img src={getImageUrl(comment.author.profilePicture)} alt={comment.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white text-xs font-bold">
                                                {comment.author.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm inline-block max-w-full relative group-hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-baseline mb-0.5 space-x-2">
                                                <span className="font-bold text-xs text-slate-900 cursor-pointer hover:underline">{comment.author.name}</span>
                                                <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-snug">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Comment */}
                    <form onSubmit={handleAddComment} className="flex items-center space-x-2 bg-white rounded-full border border-slate-200 px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 bg-transparent border-none px-3 py-2 text-sm focus:outline-none focus:ring-0 placeholder:text-slate-400"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;
