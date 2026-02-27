import React from 'react'
import { FaUserLarge } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const StoryCard = ({profileImage, userName, ownStory=false, hasStory=false, username, isViewed=false}) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
      if (ownStory && !hasStory) {
        // If it's own story and user doesn't have a story, go to upload
        navigate('/upload-story');
      } else if (username) {
        // Navigate to view story
        navigate(`/story/${username}`);
      }
    };
    
    // Determine border style based on viewed status
    const borderClass = hasStory
      ? isViewed
        ? ""
        : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
      : ownStory
        ? ""
        : "bg-gray-300";
    
return (
  <div className="flex flex-col w-[80px] md:w-[100px]  items-center  ">
    <div
    onClick={handleClick}
     className={`relative p-[4px] rounded-full cursor-pointer ${borderClass}`}>
      <div className=" h-16 w-16 md:h-20 md:w-20 object-cover overflow-hidden rounded-full flex justify-center items-center bg-gray-500">
        {profileImage ? (
          <img
            src={profileImage}
            alt={userName}
            className="object-cover h-full w-full"
          />
        ) : (
          <FaUserLarge className="text-white text-3xl" />
        )}
        {ownStory && (
          <div className="absolute bottom-0 right-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full h-8 w-8 shadow-md flex justify-center items-center ">
            <p className="text-white text-2xl font-bold">+</p>
          </div>
        )}
      </div>
    </div>
    <p className="text-sm text-center mt-1 truncate w-full">{userName}</p>
  </div>
);
}

export default StoryCard
