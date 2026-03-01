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
import { likePost, addComment, removePost } from '../redux/postSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Follow from './Resuable/Follow'
import { motion, AnimatePresence } from 'framer-motion'

import moment from 'moment'
import { AiOutlineEdit } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { MdInfo, MdReport } from 'react-icons/md'
import { MdReportProblem } from 'react-icons/md'
import ReportPost from './report/ReportPost'


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
  const [clickThreedots, setClickThreeDots] = useState(false)
  const isOwnPost = post?.author?._id === userData?._id;
  const [showReportModal, setShowReportModal] = useState(false)
  

  

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

  // Lock body scroll when  modal is open
  useEffect(() => {
    if (showComments || clickThreedots) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showComments, clickThreedots]);

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

  const handleEditPost = (postId) => {
    try {
      navigate(`/edit-post/${postId}`);
    } catch (error) {
      console.error('Error navigating to edit post:', error);
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      console.log("Attempting to delete post with ID:", postId);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/posts/delete/${postId}`,
        { withCredentials: true }
      );
      
      // Update Redux store
      dispatch(removePost(postId));

      toast.success(response.data.message || 'Post deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
    finally {
      setClickThreeDots(false);
    }
  }

  return (
    <div className="bg-surface text-text-primary rounded-2xl transition-all duration-200 overflow-hidden shadow-lg border border-border mb-6 hover:shadow-xl">
      {/* Post Header */}
      <div
        className="flex items-center justify-between px-4 py-4 backdrop-blur-sm border-b border-border bg-linear-to-r from-purple-500/10 to-pink-500/10"
      >
        <div
          onClick={() => navigate(`/profile/${post?.author?.username}`)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="h-11 w-11 rounded-full overflow-hidden p-0.5 bg-linear-to-r from-purple-500 to-pink-500 shadow-lg">
            <div className="h-full w-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
              {post?.author?.profileImage ? (
                <img
                  src={post.author.profileImage}
                  alt={post.author.name}
                  className="object-cover h-full w-full"
                />
              ) : (
                <FaUserLarge className="text-text-secondary text-lg" />
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-sm text-text-primary">
              {post?.author?.username || "username"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOwnPost && (
            <Follow userId={post?.author?._id} />
          )}
          <button
            onClick={() => setClickThreeDots(true)}
            className="cursor-pointer text-text-secondary hover:text-text-primary transition-colors p-2 hover:scale-105 rounded-full"
          >
            <BsThreeDots className="text-xl" />
          </button>
        </div>
      </div>

      {/* Post Media */}
      <div
        onDoubleClick={handleDoubleClick}
        className="w-full relative cursor-pointer select-none group bg-media-bg"
  
      >
        {post?.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={post.mediaUrl}
            controls
            // muted
            loop
            // autoPlay={true}
            className="w-full max-h-150 object-contain"
          />
        ) : (
          <img
            src={post?.mediaUrl || "/placeholder-image.jpg"}
            alt="Post"
            className="w-full max-h-150 object-contain  duration-300"
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
                  <CiHeart className="text-2xl text-text-primary group-hover:text-red-400 transition-colors" />
                )}
              </button>
              <p className="font-bold text-sm text-text-primary">
                {likesCount > 0 ? likesCount : ""}
              </p>
            </div>
            <div className="flex gap-1.5 items-center cursor-pointer group">
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                <FaRegComment className="text-xl text-blue-500 transition-colors" />
              </button>
              <p className="font-bold text-sm text-text-primary">
                {comments.length > 0 ? comments.length : ""}
              </p>
            </div>
            <button className="hover:scale-110 transition-transform duration-200 cursor-pointer group">
              <FiSend className="text-xl text-green-500 transition-colors" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="hover:scale-110 transition-transform duration-200 cursor-pointer"
          >
            {isSaved ? (
              <BsBookmarkFill className="text-xl text-yellow-500" />
            ) : (
              <BsBookmark className="text-xl text-text-secondary hover:text-yellow-500 transition-colors" />
            )}
          </button>
        </div>

        {/* Caption */}
        {post?.caption && (
          <div className="mb-2">
            <span className="font-bold text-sm mr-2 text-text-primary">
              {post?.author?.username}
            </span>
            <span className="text-sm text-text-secondary">{post.caption}</span>
          </div>
        )}
        {comments && comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-text-muted text-sm mb-2 hover:text-text-primary font-semibold transition-colors"
          >
            View all {comments.length} comments
          </button>
        )}

        {/* Time */}
        <p className="text-xs text-text-muted mt-2 uppercase tracking-wide">
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
            className="fixed inset-0 backdrop-blur-md bg-black/60 dark:bg-black/85 z-9999 flex flex-col animate-fadeIn"
            onClick={(e) =>
              e.target === e.currentTarget && setShowComments(false)
            }
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5 border-b border-border bg-linear-to-r from-purple-500/15 to-pink-500/15 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold text-text-primary">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-text-secondary hover:text-text-primary text-3xl transition-colors cursor-pointer duration-300"
              >
                ×
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-bg/95">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-xl transition-colors bg-purple-500/10 hover:bg-purple-500/15"
                  >
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-purple-500 shrink-0">
                      {comment.author?.profileImage ? (
                        <img
                          src={comment.author.profileImage}
                          alt={comment.author?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <FaUserLarge className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 justify-between mb-1">
                        <p className="font-bold text-sm text-text-primary mb-1">
                          {comment.author?.username || comment.author?.name}
                        </p>
                        <p className="px-2.5 py-1.5 border border-purple-500/50 rounded-full text-text-muted text-xs bg-purple-500/10">
                          {moment(comment.createdAt).fromNow()}
                        </p>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <FaRegComment className="text-6xl text-blue-500 mx-auto mb-4" />
                  <p className="text-text-primary text-lg">No comments yet</p>
                  <p className="text-text-muted text-sm mt-2">
                    Be the first to comment!
                  </p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <form
              onSubmit={handleCommentSubmit}
              className="p-5 border-t border-border bg-surface/95 backdrop-blur-sm flex gap-3"
            >
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-text-primary bg-surface-hover px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-text-muted"
              />

              <button
                type="submit"
                disabled={!comment.trim()}
                className="hover:scale-110 transition-transform duration-200 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="text-2xl text-green-400 transition-colors" />
              </button>
            </form>
          </motion.div>,
          document.body,
        )}

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <ReportPost
            postId={post._id}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Post Options Modal */}
      {clickThreedots &&
        createPortal( //create portal to render modal at the end of body to avoid z-index and overflow issues
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 backdrop-blur-md bg-black/50 z-9999 flex items-center justify-center animate-fadeIn"
            
            onClick={() => setClickThreeDots(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-surface rounded-2xl overflow-hidden w-full max-w-md mx-4 border-2 border-border shadow-lg"
              
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              {isOwnPost ? (
                // Options for own post
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      // Edit post logic here
                      handleEditPost(post._id);
                      setClickThreeDots(false);
                    }}
                    className="px-6 py-4 flex items-center gap-3 text-sm font-semibold text-text-primary hover:bg-surface-hover active:bg-border transition-all duration-150 border-b border-border"
                  >
                    <AiOutlineEdit className="text-xl" />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={() => {
                      // Delete post logic here
                      handleDeletePost(post._id);
                      setClickThreeDots(false);
                    }}
                    className="px-6 py-4 flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:bg-red-100 dark:active:bg-red-950/30 transition-all duration-150 border-b border-border"
                  >
                    <FaTrash className="text-lg" />
                    <span>Delete Post</span>
                  </button>
                  <button
                    onClick={() => setClickThreeDots(false)}
                    className="px-6 py-3.5 text-center text-sm text-text-muted hover:text-text-primary hover:bg-surface-hover/50 transition-all duration-150 rounded-b-2xl"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // Options for other users' posts
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      handleSave();
                      setClickThreeDots(false);
                    }}
                    className="px-6 py-4 flex items-center gap-3 text-sm font-bold text-text-primary hover:bg-surface-hover active:bg-border transition-all duration-150 border-b border-border"
                  >
                    {isSaved ? (
                      <>
                        <BsBookmarkFill className="text-xl text-yellow-500" />
                        <span>Unsave</span>
                      </>
                    ) : (
                      <>
                        <BsBookmark className="text-xl" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      // About this account logic here
                      navigate(`/profile/${post?.author?.username}`);
                      setClickThreeDots(false);
                    }}
                    className="px-6 py-4 flex items-center gap-3 text-sm font-semibold text-text-primary hover:bg-surface-hover active:bg-border transition-all duration-150 border-b border-border"
                  >
                    <MdInfo className="text-2xl" />
                    <span>About This Account</span>
                  </button>
                  <button
                    onClick={() => {
                      // Report logic here
                      setShowReportModal(true);
                      setClickThreeDots(false);
                    }}
                    className="px-6 py-4 flex items-center gap-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:bg-red-100 dark:active:bg-red-950/30 transition-all duration-150 border-b border-border"
                  >
                    <MdReportProblem className="text-xl" />
                    <span>Report</span>
                  </button>
                  <button
                    onClick={() => setClickThreeDots(false)}
                    className="px-6 py-3.5 text-center text-sm text-text-muted hover:text-text-primary hover:bg-surface-hover/50 transition-all duration-150 rounded-b-2xl"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </div>
  );
}

export default Post
