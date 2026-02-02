import React, { useState, useEffect } from 'react'
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

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  useEffect(() => {
    if (post) {
      setIsLiked(post.likes?.includes(userData?._id));
      setLikesCount(post.likes?.length || 0);
      setComments(post.comments || []);
    }
  }, [post, userData]);

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

  const handleSave = () => {
    setIsSaved(!isSaved)
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
    <div className="border-b border-gray-700 pb-4 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary bg-gray-500 flex justify-center items-center">
            {post?.author?.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                className="object-cover h-full w-full"
              />
            ) : (
              <FaUserLarge className="text-white text-xl" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">
              {post?.author?.username || "username"}
            </p>
            <p className="text-xs text-gray-400">{post?.location || ""}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <BsThreeDots className="text-xl" />
        </button>
      </div>

      {/* Post Media */}
      <div
        onDoubleClick={handleDoubleClick}
        className="w-full bg-black relative cursor-pointer select-none"
      >
        {post?.mediaType === "video" ? (
          <video
            src={post.mediaUrl}
            controls
            className="w-full max-h-[600px] object-contain"
          />
        ) : (
          <img
            src={post?.mediaUrl || "/placeholder-image.jpg"}
            alt="Post"
            className="w-full max-h-[600px] object-contain"
          />
        )}
        
        {/* Heart Animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <FaHeart 
              className="text-red-500 text-8xl animate-ping" 
              style={{
                animation: 'heartPop 1s ease-out',
                opacity: 0
              }}
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="flex gap-1 items-center cursor-pointer">
              <button
                onClick={handleLike}
                className="hover:opacity-70 transition-opacity cursor-pointer"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500 text-2xl" />
                ) : (
                  <CiHeart className="text-2xl" />
                )}
              </button>
              <p className="font-semibold text-sm">{likesCount>0?likesCount:""}</p>
            </div>
            <div className="flex gap-1 items-center cursor-pointer">
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:opacity-70 transition-opacity cursor-pointer"
              >
                <FaRegComment className="text-xl" />
              </button>
              <p>{comments.length>0?comments.length:"" }</p>
            </div>
            <button className="hover:opacity-70 transition-opacity cursor-pointer">
              <FiSend className="text-xl" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="hover:opacity-70 transition-opacity cursor-pointer"
          >
            {isSaved ? (
              <BsBookmarkFill className="text-xl" />
            ) : (
              <BsBookmark className="text-xl" />
            )}
          </button>
        </div>

        {/* Caption */}
        {post?.caption && (
          <div className="mb-2">
            <span className="font-semibold text-sm mr-2">
              {post?.author?.username}
            </span>
            <span className="text-sm">{post.caption}</span>
          </div>
        )}
        {comments && comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-400 text-sm mb-2 hover:text-gray-300"
          >
            View all {comments.length} comments
          </button>
        )}

        {/* Time */}
        <p className="text-xs text-gray-400 mt-2">
          {post?.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Just now"}
        </p>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="max-w-[50%] h-[80vh] mt-[50px] mx-auto fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col">
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
                      {comment?.author?.name}
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
            onSubmit={handleCommentSubmit}
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
          <div className="h-4">
            
        </div>
      )}
    </div>
  );
}

export default Post
