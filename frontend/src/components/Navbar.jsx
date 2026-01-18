import React from 'react'
import { GoHome, GoHomeFill } from "react-icons/go"
import { IoSearchOutline } from "react-icons/io5"
import { IoMdAddCircleOutline } from "react-icons/io"
import { MdOutlineSlowMotionVideo } from "react-icons/md"
import { FaUserLarge } from "react-icons/fa6"
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { userData } = useSelector((state) => state.user)

  const navigate = useNavigate();
  
  return (
    <div className="w-[95%] sm:w-[90%] lg:w-[40%] h-16 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 shadow-2xl backdrop-blur-lg  text-white fixed bottom-2 md:bottom-4  rounded-full flex justify-around items-center z-50 px-4">
      {/* Home */}
      <button className="flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200 group cursor-pointer">
        <GoHomeFill className="text-2xl sm:text-3xl group-hover:text-yellow-300 transition-colors" />
        <span className="text-[10px] mt-1 hidden sm:block">Home</span>
      </button>

      {/* Search */}
      <button className="flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200 group cursor-pointer">
        <IoSearchOutline className="text-2xl sm:text-3xl group-hover:text-yellow-300 transition-colors" />
        <span className="text-[10px] mt-1 hidden sm:block">Search</span>
      </button>

      {/* Add/Create */}
      <button className="flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200 group cursor-pointer">
        <div className=" bg-white rounded-full p-0.5">
          <IoMdAddCircleOutline className="text-xl sm:text-3xl text-purple-600 group-hover:text-pink-600 transition-colors" />
        </div>
        <span className="text-[10px] mt-1 hidden sm:block">Create</span>
      </button>

      {/* Vibes */}
      <button className="flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200 group cursor-pointer">
        <MdOutlineSlowMotionVideo className="text-2xl sm:text-3xl group-hover:text-yellow-300 transition-colors" />
        <span className="text-[10px] mt-1 hidden sm:block">Vibes</span>
      </button>

      {/* Profile */}
      <button
      onClick={() => navigate(`/profile/${userData?.username}`)}
      className="flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200 group cursor-pointer">
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border-2 border-white group-hover:border-yellow-300 transition-colors flex justify-center items-center bg-gray-700">
          {userData && userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt={userData.name}
              className="object-cover h-full w-full"
            />
          ) : (
            <FaUserLarge className="text-white text-sm" />
          )}
        </div>
        <span className="text-[10px] mt-1 hidden sm:block">Profile</span>
      </button>
    </div>
  );
}

export default Navbar
