import React from 'react'
import { CiHeart } from "react-icons/ci";
import {useSelector} from 'react-redux';
import StoryCard from './StoryCard';
import Post from './Post';
import Navbar from './navbar';


const Feed = () => {
  const {userData} = useSelector((state) => state.user);

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
        {/* Sample posts - Replace with actual posts from API */}
        <Post
          post={{
            author: {
              username: "john_doe",
              profileImage: "",
            },
            mediaType: "image",
            mediaUrl:
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            caption: "Beautiful mountain view! 🏔️ #nature #adventure",
            likes: [1, 2, 3, 4, 5],
            comments: [],
            createdAt: new Date(),
          }}
        />
        <Post
          post={{
            author: {
              username: "jane_smith",
              profileImage: "",
            },
            mediaType: "image",
            mediaUrl:
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
            caption: "Exploring new horizons ✨",
            likes: [1, 2, 3],
            comments: [{}, {}],
            createdAt: new Date(Date.now() - 86400000),
          }}
        />
        <Post
          post={{
            author: {
              username: "travel_lover",
              profileImage: "",
            },
            mediaType: "image",
            mediaUrl:
              "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
            caption: "Wanderlust 🌍",
            likes: [1, 2, 3, 4, 5, 6, 7, 8],
            comments: [],
            createdAt: new Date(Date.now() - 172800000),
          }}
        />
      </div>
      <div className="w-full min-h-screen flex flex-col relative items-center gap-5 pt-10 pb-10 bg-white rounded">
        <Navbar />
      </div>
    </div>
  );
}

export default Feed
