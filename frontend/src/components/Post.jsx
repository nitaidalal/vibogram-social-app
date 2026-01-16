import React, { useState } from 'react'
import { FaUserLarge } from "react-icons/fa6"
import { CiHeart } from "react-icons/ci"
import { FaHeart } from "react-icons/fa"
import { FaRegComment } from "react-icons/fa"
import { FiSend } from "react-icons/fi"
import { BsBookmark } from "react-icons/bs"
import { BsBookmarkFill } from "react-icons/bs"
import { BsThreeDots } from "react-icons/bs"

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      // Handle comment submission logic here
      console.log('Comment:', comment)
      setComment('')
    }
  }

  return (
    <div className='border-b border-gray-700 pb-4 mb-4'>
      {/* Post Header */}
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 rounded-full overflow-hidden border-2 border-primary bg-gray-500 flex justify-center items-center'>
            {post?.author?.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                className='object-cover h-full w-full'
              />
            ) : (
              <FaUserLarge className='text-white text-xl' />
            )}
          </div>
          <div>
            <p className='font-semibold text-sm'>{post?.author?.username || 'username'}</p>
            <p className='text-xs text-gray-400'>{post?.location || ''}</p>
          </div>
        </div>
        <button className='text-gray-400 hover:text-white'>
          <BsThreeDots className='text-xl' />
        </button>
      </div>

      {/* Post Media */}
      <div className='w-full bg-black'>
        {post?.mediaType === 'video' ? (
          <video
            src={post.mediaUrl}
            controls
            className='w-full max-h-[600px] object-contain'
          />
        ) : (
          <img
            src={post?.mediaUrl || '/placeholder-image.jpg'}
            alt='Post'
            className='w-full max-h-[600px] object-contain'
          />
        )}
      </div>

      {/* Post Actions */}
      <div className='px-4 pt-3'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-4'>
            <button onClick={handleLike} className='hover:opacity-70 transition-opacity'>
              {isLiked ? (
                <FaHeart className='text-red-500 text-2xl' />
              ) : (
                <CiHeart className='text-2xl' />
              )}
            </button>
            <button 
              onClick={() => setShowComments(!showComments)} 
              className='hover:opacity-70 transition-opacity'
            >
              <FaRegComment className='text-xl' />
            </button>
            <button className='hover:opacity-70 transition-opacity'>
              <FiSend className='text-xl' />
            </button>
          </div>
          <button onClick={handleSave} className='hover:opacity-70 transition-opacity'>
            {isSaved ? (
              <BsBookmarkFill className='text-xl' />
            ) : (
              <BsBookmark className='text-xl' />
            )}
          </button>
        </div>

        {/* Likes Count */}
        <p className='font-semibold text-sm mb-2'>
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        {post?.caption && (
          <div className='mb-2'>
            <span className='font-semibold text-sm mr-2'>{post?.author?.username}</span>
            <span className='text-sm'>{post.caption}</span>
          </div>
        )}

        {/* View Comments */}
        {post?.comments && post.comments.length > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className='text-gray-400 text-sm mb-2 hover:text-gray-300'
          >
            View all {post.comments.length} comments
          </button>
        )}

        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} className='flex items-center  gap-2 pt-2 border-t border-gray-700'>
          <input
            type='text'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Add a comment...'
            className='flex-1 bg-gray-800 rounded-md border border-gray-700 px-3 outline-none text-sm py-3 focus:border-primary'
          />
          {comment.trim() && (
            <button
              type='submit'
              className='text-blue-500 font-semibold text-sm hover:text-blue-400'
            >
              Post
            </button>
          )}
        </form>

        {/* Time */}
        <p className='text-xs text-gray-400 mt-2'>
          {post?.createdAt 
            ? new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            : 'Just now'}
        </p>
      </div>
    </div>
  )
}

export default Post
