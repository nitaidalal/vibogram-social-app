import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaUserLarge } from "react-icons/fa6";
import { FaHeart, FaUserPlus } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdDeleteOutline, MdDoneAll } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  markAllRead,
  markOneRead,
  removeNotification,
  clearAllNotifications,
} from "../redux/notificationSlice";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";



const TYPE_META = {
  like: {
    icon: <FaHeart className="text-xs" />,
    bg: "bg-red-500",
    label: "liked",
  },
  comment: {
    icon: <FaRegComment className="text-xs" />,
    bg: "bg-blue-500",
    label: "commented",
  },
  follow: {
    icon: <FaUserPlus className="text-xs" />,
    bg: "bg-purple-500",
    label: "followed",
  },
};

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notification
  );
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  // ── Mark all as read ─────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/mark-all-read`,
        {},
        { withCredentials: true }
      );
      dispatch(markAllRead());
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  // ── Mark one as read ─────────────────────────
  const handleMarkOneRead = async (notificationId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      dispatch(markOneRead(notificationId));
    } catch {
      // silent
    }
  };

  // ── Delete one ───────────────────────────────
  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/${notificationId}`,
        { withCredentials: true }
      );
      dispatch(removeNotification(notificationId));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  // ── Clear all ────────────────────────────────
  const handleClearAll = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/notifications/all`,
        { withCredentials: true }
      );
      dispatch(clearAllNotifications());
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  // ── Navigate on click ────────────────────────
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) handleMarkOneRead(notification._id);
    if (notification.post) navigate(`/post/${notification.post._id}`);
    else if (notification.vibe) navigate(`/vibe/${notification.vibe._id}`);
    else if (notification.type === "follow")
      navigate(`/profile/${notification.sender?.username}`);
  };

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="min-h-screen bg-bg text-text-primary sm:ml-[72px] lg:ml-[240px]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {/* Action buttons */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary border border-border hover:border-primary px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                >
                  <MdDoneAll className="text-base" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              <button
                onClick={handleClearAll}
                title="Clear all"
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-red-500 border border-border hover:border-red-400 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
              >
                <RiDeleteBin6Line className="text-base" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 items-center mb-5">
          {["all", "unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer capitalize ${
                filter === tab
                  ? "bg-primary text-white"
                  : "bg-surface-hover text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab}
              {tab === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-fuchsia-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-text-secondary">
            <div className="p-5 rounded-full bg-surface-hover">
              <IoNotificationsOutline className="text-5xl" />
            </div>
            <p className="text-lg font-medium">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="text-sm text-center max-w-xs">
              {filter === "unread"
                ? "You're all caught up!"
                : "When someone likes, comments on your posts or follows you, you'll see it here."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((notification) => {
              const meta = TYPE_META[notification.type] || TYPE_META.like;
              const sender = notification.sender;
              const mediaThumb =
                notification.post?.mediaUrl || notification.vibe?.mediaUrl;

              return (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative
                    ${
                      !notification.isRead
                        ? "bg-primary/8 hover:bg-primary/12 border border-primary/30"
                        : "hover:bg-surface-hover border border-border "
                    }`}
                >
                  {/* Unread dot */}
                  {!notification.isRead && (
                    <span className="absolute left-[-15px] top-[-10px] px-2 py-1 text-xs rounded-full bg-danger shrink-0 -rotate-45 animate-pulse">
                        New
                    </span>
                  )}

                  {/* Avatar + type badge */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-surface-hover border border-border">
                      {sender?.profileImage ? (
                        <img
                          src={sender.profileImage}
                          alt={sender.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserLarge className="text-text-secondary text-lg" />
                        </div>
                      )}
                    </div>
                    {/* Type icon badge */}
                    <span
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white ${meta.bg} border-2 border-bg`}
                    >
                      {meta.icon}
                    </span>
                  </div>

                  {/* Message + time */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug line-clamp-2">
                      <span
                        className="font-semibold hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profile/${sender?.username}`);
                        }}
                      >
                        {sender?.name || sender?.username}
                      </span>{" "}
                      <span className="text-text-secondary">
                        {notification.message}
                      </span>
                    </p>
                    <span className="text-xs text-text-secondary mt-0.5 block">
                      {moment(notification.createdAt).fromNow()}
                    </span>
                  </div>

                  {/* Media thumbnail (if post/vibe) */}
                  {mediaThumb && (
                    <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-border">
                      {notification.post?.mediaType === "video" ||
                      notification.vibe ? (
                        <video
                          src={mediaThumb}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={mediaThumb}
                          alt="media"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(e, notification._id)}
                    className="shrink-0 p-1.5 rounded-full text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                    title="Remove"
                  >
                    <MdDeleteOutline className="text-lg" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 sm:hidden" />
    </div>
  );
};

export default Notifications;
