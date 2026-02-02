import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaPlay, FaPause } from 'react-icons/fa';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { likeVibe, addVibeComment } from '../redux/vibeSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const VibeCard = ({
  vibe,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  currentIndex,
  totalVibes,
  refreshVibes,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (vibe) {
      setIsLiked(vibe.likes?.includes(userData?._id));
      setLikesCount(vibe.likes?.length || 0);
      setComments(vibe.comments || []);
      
      // Auto-play video when component mounts or vibe changes
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [vibe, userData]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vibes/like/${vibe._id}`,
        {},
        { withCredentials: true }
      );

      setIsLiked(!isLiked);
      
      // Update Redux store
      dispatch(likeVibe({ 
        vibeId: vibe._id, 
        likes: response.data.vibe.likes 
      }));
      setLikesCount(response.data.vibe.likes.length);
    } catch (error) {
      console.error('Error liking vibe:', error);
      toast.error('Failed to like vibe');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/vibes/comment/${vibe._id}`,
        { content: comment },
        { withCredentials: true }
      );

      setComments(response.data.vibe.comments);
      setComment('');
      
      // Update Redux store
      dispatch(addVibeComment({ 
        vibeId: vibe._id, 
        comments: response.data.vibe.comments 
      }));
      
      toast.success('Comment added!');
      refreshVibes();
    } catch (error) {
      console.error('Error commenting on vibe:', error);
      toast.error('Failed to add comment');
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={vibe.mediaUrl}
        className="w-full h-full object-contain cursor-pointer"
        loop
        playsInline
        onClick={handleVideoClick}
        onDoubleClick={handleLike}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FaPlay className="text-white text-6xl opacity-80" />
        </div>
      )}

      {/* Navigation Arrows */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
        {hasPrevious && (
          <button
            onClick={onPrevious}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <IoIosArrowUp className="text-white text-2xl" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <IoIosArrowDown className="text-white text-2xl" />
          </button>
        )}
      </div>

      {/* Vibe Counter */}
      <div className="absolute top-20 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {totalVibes}
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pb-24">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={vibe.author?.profileImage || "/default-avatar.png"}
            alt={vibe.author?.name}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="font-semibold text-white">{vibe.author?.name}</p>
            <p className="text-sm text-gray-300">@{vibe.author?.username}</p>
          </div>
        </div>

        {/* Caption */}
        {vibe.caption && (
          <p className="text-white mb-4 text-sm">{vibe.caption}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 hover:scale-110 transition-transform"
          >
            {isLiked ? (
              <FaHeart className="text-red-500 text-2xl" />
            ) : (
              <FaRegHeart className="text-white text-2xl" />
            )}
            <span className="text-white font-semibold">{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:scale-110 transition-transform"
          >
            <FaComment className="text-white text-2xl" />
            <span className="text-white font-semibold">{comments.length}</span>
          </button>

          <button
            onClick={togglePlayPause}
            className="flex items-center gap-2 hover:scale-110 transition-transform ml-auto"
          >
            {isPlaying ? (
              <FaPause className="text-white text-2xl" />
            ) : (
              <FaPlay className="text-white text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={comment.author?.profileImage || "/default-avatar.png"}
                    alt={comment.author?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {comment.author?.name}
                    </p>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No comments yet</p>
            )}
          </div>

          {/* Comment Input */}
          <form
            onSubmit={handleComment}
            className="p-4 border-t border-gray-700 flex gap-2"
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold transition-colors"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VibeCard;
