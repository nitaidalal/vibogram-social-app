import React from 'react'
import { CiHeart } from 'react-icons/ci'
import { FaUserLarge } from 'react-icons/fa6'

const StoryCard = ({profileImage,userName}) => {
return (
    <div className="flex flex-col w-[80px] md:w-[100px]  items-center  ">
        <div className='p-[4px] rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600'>
            <div className="h-16 w-16 md:h-20 md:w-20 object-cover overflow-hidden rounded-full flex justify-center items-center bg-gray-500">
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={userName}
                        className="object-cover h-full w-full"
                    />
                ) : (
                    <FaUserLarge className="text-white text-3xl" />
                )}
            </div>
        </div>
        <p className="text-sm text-center mt-1 truncate w-full">{userName}</p>
    </div>
);
}

export default StoryCard
