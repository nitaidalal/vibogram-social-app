import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toggleTheme } from "../redux/themeSlice";
import { clearUserData } from "../redux/userSlice";
import axios from "axios";

// Icons
import { GoHomeFill, GoHome } from "react-icons/go";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  MdOutlineSlowMotionVideo,
  MdSlowMotionVideo,
  MdOutlineExplore,
  MdExplore,
} from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { LuSend } from "react-icons/lu";

import LogoutModal from "./settings/LogoutModal";



const LeftHome = () => {
  const { userData } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const { unreadSenders } = useSelector((state) => state.message);
  const unreadCount = unreadSenders?.length; 
  const { unreadCount: notifCount } = useSelector((state) => state.notification);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearUserData());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: isActive("/") ? (
        <GoHomeFill className="text-2xl" />
      ) : (
        <GoHome className="text-2xl" />
      ),
    },
    {
      label: "Search",
      path: "/search",
      icon: isActive("/search") ? (
        <IoSearch className="text-2xl" />
      ) : (
        <IoSearchOutline className="text-2xl" />
      ),
    },
    {
      label: "Explore",
      path: "/explore",
      icon: isActive("/explore") ? (
        <MdExplore className="text-2xl" />
      ) : (
        <MdOutlineExplore className="text-2xl" />
      ),
    },
    {
      label: "Vibes",
      path: "/vibes",
      icon: isActive("/vibes") ? (
        <MdSlowMotionVideo className="text-2xl" />
      ) : (
        <MdOutlineSlowMotionVideo className="text-2xl" />
      ),
    },
    {
      label: "Create",
      path: "/upload",
      icon: <IoMdAddCircleOutline className="text-2xl" />,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: isActive("/notifications") ? (
        <div className="relative">
          <IoNotifications className="text-2xl" />
          {notifCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </div>
      ) : (
        <div className="relative">
          <IoNotificationsOutline className="text-2xl" />
          {notifCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Messages",
      path: "/messages",
      icon: isActive("/messages") ? (
        <div className="relative">
          <LuSend className="text-2xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      ) : (
        <div className="relative">
          <LuSend className="text-2xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Saved",
      path: "/saved",
      icon: isActive("/saved") ? (
        <BsBookmarkFill className="text-xl" />
      ) : (
        <BsBookmark className="text-xl" />
      ),
    },
  ];

  return (
    <div
      className="
        hidden sm:flex flex-col justify-between
        fixed left-0 top-0 h-screen z-40
        sm:w-[72px] lg:w-[240px]
        bg-bg border-r border-border
        text-text-primary
        transition-all duration-300
      "
    >
      {/* ── TOP SECTION ── */}
      <div>
        {/* Logo */}
        <div className="flex items-center md:justify-center lg:justify-start px-3 h-16 mb-1">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-9 w-9 shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <span
            className="text-primary text-3xl font-bold ml-0.5 hidden lg:block cursor-pointer"
            onClick={() => navigate("/")}
          >
            ynox
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                title={item.label}
                className={`
                  flex items-center gap-3.5 px-3 py-3 rounded-xl
                  transition-all duration-200 w-full cursor-pointer
                  md:justify-center lg:justify-start
                  ${
                    active
                      ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }
                `}
              >
                <span className="shrink-0">{item.icon}</span>
                <span
                  className={`text-sm hidden lg:block ${active ? "font-semibold" : "font-normal"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Profile */}
          <button
            onClick={() => navigate(`/profile/${userData?.username}`)}
            title="Profile"
            className={`
              flex items-center gap-3.5 px-3 py-3 rounded-xl
              transition-all duration-200 w-full cursor-pointer
              md:justify-center lg:justify-start
              ${
                isActive(`/profile/${userData?.username}`)
                  ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }
            `}
          >
            <div
              className="
                h-9 w-9 rounded-full overflow-hidden shrink-0
                border-2 border-primary flex justify-center items-center bg-surface
              "
            >
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={userData.name}
                  className="object-cover h-full w-full"
                />
              ) : (
                <FaUserLarge className="text-[11px]" />
              )}
            </div>
            <span
              className={`text-sm hidden lg:block ${
                isActive(`/profile/${userData?.username}`)
                  ? "font-semibold"
                  : "font-normal"
              }`}
            >
              Profile
            </span>
          </button>
        </nav>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="flex flex-col gap-0.5 px-2 pb-5">
        {/* Divider */}
        <div className="mx-3 mb-1 border-t border-border" />

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          title="Settings"
          className={`
            flex items-center gap-3.5 px-3 py-3 rounded-xl
            transition-all duration-200 w-full cursor-pointer
            md:justify-center lg:justify-start
            ${
              isActive("/settings")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            }
          `}
        >
          <IoSettingsOutline className="text-[21px] shrink-0" />
          <span className="text-sm hidden lg:block">Settings</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          className="
            flex items-center gap-3.5 px-3 py-3 rounded-xl
            transition-all duration-200 w-full cursor-pointer
            md:justify-center lg:justify-start
            text-text-secondary hover:bg-surface-hover hover:text-text-primary
          "
        >
          {theme === "dark" ? (
            <HiOutlineSun className="text-[21px] shrink-0 text-yellow-400" />
          ) : (
            <HiOutlineMoon className="text-[21px] shrink-0" />
          )}
          <span className="text-sm hidden lg:block">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          title="Logout"
          className="
            flex items-center gap-3.5 px-3 py-3 rounded-xl
            transition-all duration-200 w-full cursor-pointer
            md:justify-center lg:justify-start
            text-text-secondary hover:bg-danger/10 hover:text-danger
          "
        >
          <LuLogOut className="text-[21px] shrink-0" />
          <span className="text-sm hidden lg:block">Logout</span>
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default LeftHome;
