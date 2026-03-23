import React from 'react'
import { GoHomeFill, GoHome } from "react-icons/go"
import { IoSearchOutline } from "react-icons/io5"
import { MdOutlineSlowMotionVideo } from "react-icons/md"
import { FaUserLarge } from "react-icons/fa6"
import { LuSend } from "react-icons/lu"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from 'react-router-dom'


const Navbar = () => {
  const { userData } = useSelector((state) => state.user)
  const { unreadSenders } = useSelector((state) => state.message)
  const unreadCount = unreadSenders?.length

  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sm:hidden w-full h-16 bg-surface/95 border-t border-border backdrop-blur-md text-text-primary fixed bottom-0 flex justify-around items-center z-50 px-4">
      {/* Home */}
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${isActive("/") ? "text-primary" : "text-text-secondary hover:text-text-primary"}`}
      >
        {isActive("/") ? <GoHomeFill className="text-2xl" /> : <GoHome className="text-2xl" />}
      </button>

      {/* Search */}
      <button
        onClick={() => navigate("/search")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${isActive("/search") ? "text-primary" : "text-text-secondary hover:text-text-primary"}`}
      >
        <IoSearchOutline className="text-2xl" />
      </button>

      {/* Messages */}
      <button
        onClick={() => navigate("/messages")}
        className={`relative flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${isActive("/messages") ? "text-primary" : "text-text-secondary hover:text-text-primary"}`}
      >
        <LuSend className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Vibes */}
      <button
        onClick={() => navigate("/vibes")}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${isActive("/vibes") ? "text-primary" : "text-text-secondary hover:text-text-primary"}`}
      >
        <MdOutlineSlowMotionVideo className="text-2xl" />
      </button>

      {/* Profile */}
      <button
        onClick={() => navigate(`/profile/${userData?.username}`)}
        className="flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
      >
        <div className={`h-8 w-8 rounded-full overflow-hidden border-2 ${isActive(`/profile/${userData?.username}`) ? "border-primary" : "border-border"} flex justify-center items-center bg-surface-hover transition-colors`}>
          {userData && userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt={userData.name}
              className="object-cover h-full w-full"
            />
          ) : (
            <FaUserLarge className="text-text-secondary text-sm" />
          )}
        </div>
      </button>
    </div>
  );
}

export default Navbar
