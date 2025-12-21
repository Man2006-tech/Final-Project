import { useState, useRef } from 'react';
import { X, Image, Send, Link as LinkIcon, Loader } from 'lucide-react';
import { postAPI, userAPI } from '../../services/api';
import Button from '../common/Button';

const CreatePostModal = ({ isOpen, onClose, userId, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await userAPI.uploadFile(formData);
            // FileController returns full URL in fileDownloadUri
            setMediaUrl(response.data.fileDownloadUri);
            setShowUrlInput(false);
        } catch (err) {
            console.error("Upload failed", err);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !mediaUrl) return;

        setLoading(true);
        setError('');

        try {
            await postAPI.createPost(userId, {
                contentText: content,
                mediaUrl: mediaUrl || null,
                visibility: 'PUBLIC'
            });
            setContent('');
            setMediaUrl('');
            onPostCreated();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden relative animate-in zoom-in-95 duration-200 border border-white/20">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Post</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200/80 text-gray-500 transition-all hover:rotate-90 duration-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            {error}
                        </div>
                    )}

                    <div className="flex space-x-3 mb-4">
                        <textarea
                            placeholder="What's on your mind?"
                            className="w-full text-lg placeholder-gray-400 border-none resize-none focus:ring-0 min-h-[150px] p-2 rounded-xl bg-transparent"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Media Preview */}
                    {(mediaUrl || uploading) && (
                        <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 aspect-video mb-4 group">
                            {uploading ? (
                                <div className="absolute inset-0 flex items-center justify-center flex-col text-blue-500">
                                    <Loader size={32} className="animate-spin mb-2" />
                                    <span className="text-sm font-medium">Uploading...</span>
                                </div>
                            ) : (
                                <>
                                    <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    <button
                                        type="button"
                                        onClick={() => setMediaUrl('')}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                        <div className="flex space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 rounded-full text-blue-500 hover:bg-blue-50 transition-colors flex items-center space-x-2 group"
                                title="Upload Image"
                            >
                                <Image size={22} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowUrlInput(!showUrlInput)}
                                className={`p-2.5 rounded-full transition-colors flex items-center space-x-2 group ${showUrlInput ? 'bg-purple-50 text-purple-600' : 'text-purple-500 hover:bg-purple-50'}`}
                                title="Add Image URL"
                            >
                                <LinkIcon size={22} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:translate-y-[-1px]"
                            loading={loading}
                            disabled={(!content.trim() && !mediaUrl) || uploading}
                        >
                            <span className="mr-2 font-semibold">Post</span>
                            <Send size={18} />
                        </Button>
                    </div>

                    {/* URL Input Collapsible */}
                    {showUrlInput && (
                        <div className="mt-3 animate-in slide-in-from-top-2 fade-in">
                            <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:ring-2 ring-purple-500/20 transition-all">
                                <LinkIcon size={16} className="text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="Paste image link here..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                                    value={mediaUrl}
                                    onChange={(e) => setMediaUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
