import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'
import {  toggleFollow } from '../../redux/userSlice'

const Follow = ({ userId, location = "", onFollowChange }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { following } = useSelector((state) => state.user);
  const isFollowing = following.includes(userId);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!userId || isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );

      dispatch(toggleFollow(userId));
      
      
      toast.success(response.data.message);
      
      // Immediately reflect follow status change in parent component if callback is provided
      if (onFollowChange) {
        onFollowChange();
      }
  
    } catch (error) {
      console.error('Error following user:', error);
      toast.error(error.response?.data?.message || 'Failed to follow user');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyles = isFollowing
    ? `${location=="profile"?"flex-1":""} ${theme=="dark"?("px-4 py-1.5 bg-surface hover:bg-gray-600"):"px-4 py-1.5 bg-linear-to-r from-pink-500/20 to-fuchsia-500/20 text-accent border border-pink-500 hover:bg-gray-100 shadow-sm"}}`
    : `${location=="profile"?"flex-1":""} px-4 py-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-600 hover:to-fuchsia-600 shadow-lg hover:shadow-pink-700/50`;

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`${buttonStyles} text-sm font-semibold rounded-lg transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default Follow;
