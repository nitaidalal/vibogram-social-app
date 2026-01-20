import React from 'react'
import { CiHeart } from "react-icons/ci";
import {useSelector} from 'react-redux';
import StoryCard from './StoryCard';
import Post from './Post';
import Navbar from './navbar';
import { useState,useEffect } from 'react';
import axios from 'axios';


const Feed = () => {
  const {userData} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/getAllPosts`, {
        withCredentials: true
      });
      setPosts(response.data.posts || []);
      console.log("All Posts:", response.data.posts);
    } catch (error) {
      console.log("Error fetching posts:", error?.response?.data?.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

useEffect(() => {
    getAllPosts();
}, []);
  

  return (
    <div className="w-full lg:w-[50%] lg:ml-[25%] min-h-screen  bg-dark-bg text-dark-text overflow-y-auto border-gray-700 relative">
      <div className="flex mx-6 lg:hidden  justify-between items-center h-14 ">
        <div className="flex ">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 "
          />
          <span className="text-primary text-2xl sm:text-3xl font-bold ">
            ibogram
          </span>
        </div>
        <div>
          <CiHeart className="text-4xl" />
        </div>
      </div>

      {/* stories section */}
      <div className="flex  items-center gap-3 py-3 overflow-x-auto px-2">
        {/* <StoryCard/> */}
        <StoryCard userName="nitai;kjmdsjfgsjglsj" />
        <StoryCard userName="nitai" />
        <StoryCard userName="nitai" />
        <StoryCard userName="nitai" />
        <StoryCard userName="nitai" />
        <StoryCard userName="nitai" />
        <StoryCard userName="nitai" />
        <StoryCard userName="nitai" />
        <StoryCard userName="nitai" />
      </div>

      {/* Posts section */}
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <div className="text-center py-10 text-[var(--color-text-secondary)]">
            No posts yet. Be the first to share!
          </div>
        )}
      </div>
      <div className=" w-full flex justify-center ">
        <Navbar />
      </div>
    </div>
  );
}

export default Feed
