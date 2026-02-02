import React from 'react'
import { CiHeart } from "react-icons/ci";
import {useSelector, useDispatch} from 'react-redux';
import StoryCard from './StoryCard';
import Post from './Post';
import Navbar from './navbar';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { setPosts } from '../redux/postSlice';
import { setStories } from '../redux/storySlice';


const Feed = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const { posts } = useSelector((state) => state.post);
  const { stories } = useSelector((state) => state.story);

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/getAllPosts`, {
        withCredentials: true
      });
      dispatch(setPosts(response.data.posts || []));
      console.log("All Posts:", response.data.posts);
    } catch (error) {
      console.log("Error fetching posts:", error?.response?.data?.message);
      dispatch(setPosts([]));
    } finally {
      setLoading(false);
    }
  }

  const getAllStories = async () => {
    try {
      setStoriesLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/story/getAllStories`, {
        withCredentials: true
      });
      dispatch(setStories(response.data.stories || []));
      console.log("All Stories:", response.data.stories);
    } catch (error) {
      console.log("Error fetching stories:", error?.response?.data?.message);
      dispatch(setStories([]));
    } finally {
      setStoriesLoading(false);
    }
  }

useEffect(() => {
    getAllPosts();
    getAllStories();
}, []);

// const getAllVibes = async() => {
//   try {
//     setLoading(true);

//   } catch (error) {
    
//   }
// }
  

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
        {storiesLoading ? (
          <div className="flex justify-center items-center py-4 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : stories && stories.length > 0 ? (
          stories.map((story) => (
            <StoryCard 
              key={story._id} 
              profileImage={story.author?.profileImage}
              userName={story.author?.username || story.author?.name} 
            />
          ))
        ) : (
          <div className="text-center py-4 text-text-secondary w-full">
            No stories yet
          </div>
        )}
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
          <div className="text-center py-10 text-text-secondary">
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
