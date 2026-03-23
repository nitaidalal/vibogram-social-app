import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { likeVibe, addVibeComment } from '../redux/vibeSlice';
import moment from 'moment';

import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSend } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import ShareModal from './ShareModal';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const VibeCard = ({
  vibe,
  refreshVibes,
}) => {
  const { userData } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(() => vibe?.likes?.includes(userData?._id) || false);
  const [likesCount, setLikesCount] = useState(() => vibe?.likes?.length || 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(() => {
    const savedMuteState = localStorage.getItem("vibesMuted");
    return savedMuteState === null ? true : savedMuteState === "true"; // savedMuteState === null ? true -> default to muted if no preference is saved
  });
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(() => vibe?.comments || []);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const [showShare, setShowShare] = useState(false)



  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          videoRef.current?.play();
          setIsPlaying(true);
        }
        else{
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      })
    }, { threshold: 0.7 });
    if(videoRef.current){
      observer.observe(videoRef.current);
    }
    return () => {
      if(videoRef.current){
        observer.unobserve(videoRef.current);
      }
    };
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [vibe]);

  const handleLike = async () =>{

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
        likes: response.data.likes 
      }));
      setLikesCount(response.data.likes.length);
    } catch (error) {
      console.error('Error liking vibe:', error);
      toast.error('Failed to like vibe');
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1500);
    
   if(!isLiked){
    handleLike(true);
   }
  }

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

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('vibesMuted', newMutedState.toString());
  };


  return (
    <div className="relative h-[calc(100dvh-4rem)] sm:h-screen w-full snap-start bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={vibe.mediaUrl}
        className="w-full h-full object-contain cursor-pointer"
        loop
        playsInline
        muted={isMuted}
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleClick}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FaPlay className="text-white text-4xl opacity-80" />
        </div>
      )}

      {/* Heart Animation Overlay - Instagram Style */}
      {showHeartAnimation && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 0, x: 270 }}
          animate={{ scale: 1.4, opacity: 1, y: 0, x: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 180, x: 40 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <FaHeart
            className="text-6xl text-purple-500 animate-heart-pop"
            style={{
              background: "linear-gradient(to right, #ec4899, #d946ef)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))",
            }}
          />
        </motion.div>
      )}

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3  sm:pb-10">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={vibe.author?.profileImage || "/default-avatar.png"}
            alt={vibe.author?.name}
            className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
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
      </div>

      <div className="absolute bottom-48  right-4 flex items-center justify-between">
        <div className="flex items-center flex-col gap-6">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
          >
            {isLiked ? (
              <FaHeart className="text-red-500 text-2xl" />
            ) : (
              <FaRegHeart className="text-white text-2xl" />
            )}
            <span className="text-white font-semibold">
              {likesCount > 0 ? likesCount : ""}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 hover:scale-110 transition-transform cursor-pointer"
          >
            <FaRegComment className="text-white text-2xl" />
            <span className="text-white font-semibold">
              {comments.length > 0 ? comments.length : ""}
            </span>
          </button>

          <button onClick={() => setShowShare(true)}>
            <FiSend size={22} className="text-green-500 hover:text-green-600" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-20 right-8">
        <button
          onClick={toggleMute}
          className="flex flex-col items-center gap-1 hover:scale-110 transition-transform cursor-pointer"
        >
          {isMuted ? (
            <HiVolumeOff className="text-white text-2xl" />
          ) : (
            <HiVolumeUp className="text-white text-2xl" />
          )}
        </button>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/30 to-pink-900/30 flex-0">
            <h3 className="text-xl font-semibold">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Comments List */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain "
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex gap-3 bg-gray-800  p-3 rounded-lg"
                >
                  <div className="h-9 w-9 border-2 border-purple-500 rounded-full">
                    <img
                      src={
                        comment.author?.profileImage || "/default-avatar.png"
                      }
                      alt={comment.author?.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center  w-full">
                      <p className="font-semibold  text-sm">
                        {comment.author?.name}
                      </p>
                      <p className="px-2.5 py-1.5 border border-purple-500 bg-purple-500/15 rounded-full text-gray-400 text-xs">
                        {moment(comment.createdAt).fromNow()}
                      </p>
                    </div>
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
            className="p-4 border-t border-gray-700 flex gap-2 flex-shrink-0"
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
        </motion.div>
      )}
      {showShare && (
        <ShareModal
          contentId={vibe._id}
          contentType="vibe"
          onClose={() => setShowShare(false)}
          isOpen={showShare}
        />
      )}
    </div>
  );
};

export default VibeCard;
