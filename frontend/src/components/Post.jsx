import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FaUserLarge } from "react-icons/fa6"
import { CiHeart } from "react-icons/ci"
import { FaHeart } from "react-icons/fa"
import { FaRegComment } from "react-icons/fa"
import { FiSend } from "react-icons/fi"
import { BsBookmark } from "react-icons/bs"
import { BsBookmarkFill } from "react-icons/bs"
import { BsThreeDots } from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux'
import { likePost, addComment } from '../redux/postSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Follow from './Resuable/Follow'
import { motion, AnimatePresence } from 'framer-motion'
import moment from 'moment'

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { userData } = useSelector((state) => state.user); //1
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      })
    }, { threshold: 0.7 });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (post) {
      setIsLiked(post.likes?.includes(userData?._id));
      setLikesCount(post.likes?.length || 0);
      setComments(post.comments || []);
      setIsSaved(userData?.savedPosts?.includes(post._id));
    }
  }, [post, userData]);

  // Lock body scroll when comment modal is open
  useEffect(() => {
    if (showComments) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showComments]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/posts/like/${post._id}`,
        {},
        { withCredentials: true }
      );

      setIsLiked(!isLiked);
      setLikesCount(response.data.post.likes.length);
      
      // Update Redux store
      dispatch(likePost({ 
        postId: post._id, 
        likes: response.data.post.likes 
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  }

  const handleSave = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/posts/saved/${post._id}`,
        { withCredentials: true }
      );

      setIsSaved(!isSaved);
      // dispatch(({ savedPosts: response.data.savedPosts }));
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  }

  const handleDoubleClick = async () => {
    // Show heart animation
    setShowHeartAnimation(true)
    setTimeout(() => setShowHeartAnimation(false), 1000)
    
    // Like the post if not already liked
    if (!isLiked) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/posts/like/${post._id}`,
          {},
          { withCredentials: true }
        );

        setIsLiked(true);
        setLikesCount(response.data.post.likes.length);
        
        dispatch(likePost({ 
          postId: post._id, 
          likes: response.data.post.likes 
        }));
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/posts/comment/${post._id}`,
        { content: comment },
        { withCredentials: true }
      );
      
      setComments(response.data.post.comments);
      setComment('');
      
      // Update Redux store
      dispatch(addComment({ 
        postId: post._id, 
        comments: response.data.post.comments 
      }));
      
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast.error('Failed to add comment');
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl hover:scale-[1.01] transition-all duration-200 overflow-hidden shadow-2xl border border-gray-700 mb-6 hover:shadow-purple-900/30 transition-all duration-300">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
        <div
          onClick={() => navigate(`/profile/${post?.author?.username}`)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-gradient-to-r from-purple-500 to-pink-500 p-0.5 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <div className="h-full w-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              {post?.author?.profileImage ? (
                <img
                  src={post.author.profileImage}
                  alt={post.author.name}
                  className="object-cover h-full w-full"
                />
              ) : (
                <FaUserLarge className="text-white text-lg" />
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-sm text-white">
              {post?.author?.username || "username"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post?.author?._id !== userData?._id && (
            <Follow userId={post?.author?._id} />
          )}
          <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full">
            <BsThreeDots className="text-xl" />
          </button>
        </div>
      </div>

      {/* Post Media */}
      <div
        onDoubleClick={handleDoubleClick}
        className="w-full bg-black relative cursor-pointer select-none group"
      >
        {post?.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={post.mediaUrl}
            controls
            // muted
            loop
            // autoPlay={true}
            className="w-full max-h-[600px] object-contain"
          />
        ) : (
          <img
            src={post?.mediaUrl || "/placeholder-image.jpg"}
            alt="Post"
            className="w-full max-h-[600px] object-contain  duration-300"
          />
        )}

        {/* Heart Animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <FaHeart
              className="text-red-500 text-9xl drop-shadow-2xl"
              style={{
                animation: "heartPop 1s ease-out",
                opacity: 0,
              }}
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-5">
            <div className="flex gap-1.5 items-center cursor-pointer group">
              <button
                onClick={handleLike}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500 text-2xl drop-shadow-lg animate-pulse" />
                ) : (
                  <CiHeart className="text-2xl group-hover:text-red-400 transition-colors" />
                )}
              </button>
              <p className="font-bold text-sm">
                {likesCount > 0 ? likesCount : ""}
              </p>
            </div>
            <div className="flex gap-1.5 items-center cursor-pointer group">
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                <FaRegComment className="text-xl text-blue-400 transition-colors" />
              </button>
              <p className="font-bold text-sm">
                {comments.length > 0 ? comments.length : ""}
              </p>
            </div>
            <button className="hover:scale-110 transition-transform duration-200 cursor-pointer group">
              <FiSend className="text-xl text-green-400 transition-colors" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="hover:scale-110 transition-transform duration-200 cursor-pointer"
          >
            {isSaved ? (
              <BsBookmarkFill className="text-xl text-yellow-400" />
            ) : (
              <BsBookmark className="text-xl text-yellow-400 transition-colors" />
            )}
          </button>
        </div>

        {/* Caption */}
        {post?.caption && (
          <div className="mb-2">
            <span className="font-bold text-sm mr-2 text-white">
              {post?.author?.username}
            </span>
            <span className="text-sm text-gray-300">{post.caption}</span>
          </div>
        )}
        {comments && comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-400 text-sm mb-2 hover:text-white font-semibold transition-colors"
          >
            View all {comments.length} comments
          </button>
        )}

        {/* Time */}
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
          {post?.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Just now"}
        </p>
      </div>

      {/* Comments Modal rendered via Portal */}
      {showComments &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-9999 flex flex-col animate-fadeIn"
            onClick={(e) =>
              e.target === e.currentTarget && setShowComments(false)
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
              <h3 className="text-xl font-bold text-white">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-400 hover:text-white text-3xl transition-colors cursor-pointer duration-300"
              >
                ×
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex gap-3 bg-gray-800/50 p-3 rounded-xl hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                      {comment.author?.profileImage ? (
                        <img
                          src={comment.author.profileImage}
                          alt={comment.author?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <FaUserLarge className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      
                      <div className="flex items-center gap-2 justify-between mb-1">
                        <p className="font-bold text-sm text-white mb-1">
                          {comment.author?.username || comment.author?.name}
                        </p>
                        <p className="px-2.5 py-1.5 border border-purple-500 bg-purple-500/15 rounded-full text-gray-400 text-xs">{moment(comment.createdAt).fromNow()}</p>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <FaRegComment className="text-6xl text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No comments yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Be the first to comment!
                  </p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <form
              onSubmit={handleCommentSubmit}
              className="p-5 border-t border-gray-700 bg-gray-900/50 flex gap-3"
            >
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition-all"
              />

              <button
                type="submit"
                disabled={!comment.trim()}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer group"
              >
                <FiSend className="text-2xl text-green-400 transition-colors" />
              </button>
            </form>
          </motion.div>,
          document.body,
        )}
    </div>
  );
}

export default Post
