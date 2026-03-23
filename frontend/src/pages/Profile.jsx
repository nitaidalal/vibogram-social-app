import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../redux/userSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUserLarge } from "react-icons/fa6";
import { BsGrid3X3 } from "react-icons/bs";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { LuShare2 } from "react-icons/lu";
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Follow from '../components/Resuable/Follow';
import { BsBookmark } from "react-icons/bs";
import Post from '../components/Post';
import VibeCard from '../components/VibeCard';
import ShareModal from '../components/ShareModal';


const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null); // 'posts' | 'saved'
  const listRef = useRef(null);
  const selectedItemRef = useRef(null);
  const { profileData, userData } = useSelector((state) => state.user);
  const [showShare, setShowShare] = useState(false);

  const isOwnProfile = userData?.username === username;

  const handleProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/${username}`,
        { withCredentials: true },
      );

      dispatch(setProfileData(response.data.user));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load profile data",
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (username) handleProfile();
  }, [username, handleProfile]);

  // Scroll the viewer so the clicked post starts in view
  useEffect(() => {
    if (selectedSource && selectedPostIndex !== null && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [selectedSource, selectedPostIndex]);

  const getActiveList = () => {
    if (!profileData) return null;
    if (selectedSource === 'posts') return profileData.posts || [];
    if (selectedSource === 'saved') return profileData.savedPosts || [];
    if (selectedSource === 'vibes') return profileData.vibes || [];
    return null;
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-bg text-text-primary flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className=" mx-auto min-h-screen bg-bg text-text-primary pb-20 sm:ml-[72px] lg:ml-[240px]">
      {/* Header */}
      <div className=" sticky top-0 z-40 bg-bg border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl"
        >
          ←
        </button>
        <h1 className="text-xl font-semibold">{profileData?.username}</h1>
        <button className="cursor-pointer text-2xl">
          {isOwnProfile && <IoMdSettings onClick={handleSettingsClick} />}
        </button>
      </div>

      {/* Profile Info Section */}
      <div className="max-w-3xl mx-auto">
        <div className="px-4 py-6">
          {/* Profile Picture and Stats */}
          <div className="flex items-center gap-6 mb-6">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-3 border-fuchsia-500 flex justify-center items-center bg-gray-700">
                {profileData?.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt={profileData.name}
                    className="object-cover h-full w-full "
                  />
                ) : (
                  <FaUserLarge className="text-white text-4xl md:text-5xl" />
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 flex justify-around text-center">
              <div>
                <p className="text-xl md:text-2xl font-bold">
                  {profileData?.posts?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Posts</p>
              </div>
              <div className="cursor-pointer">
                <p className="text-xl md:text-2xl font-bold">
                  {profileData?.followers?.length || 0}
                </p>
                <p className="text-sm text-gray-400">
                  {profileData?.followers?.length <= 1
                    ? "Follower"
                    : "Followers"}
                </p>
              </div>
              <div className="cursor-pointer">
                <p className="text-xl md:text-2xl font-bold">
                  {profileData?.following?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Following</p>
              </div>
            </div>
          </div>

          {/* Name and Bio */}
          <div className="mb-4">
            <h2 className="font-semibold text-lg">{profileData?.name}</h2>
            {profileData?.bio && (
              <p className="text-sm text-text-secondary mt-1 whitespace-pre-line wrap-break-word">
                {profileData.bio}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowShare(true)}
                  className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Share Profile
                </button>
              </>
            ) : (
              <>
                <Follow
                  userId={profileData?._id}
                  location="profile"
                  onFollowChange={handleProfile}
                />
                <button
                  onClick={() =>
                    navigate("/messages", { state: { user: profileData } })
                  }
                  className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Message
                </button>
                <button
                  onClick={() => setShowShare(true)}
                  className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                  title="Share Profile"
                >
                  <LuShare2 className="text-lg" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 border-t-2 cursor-pointer ${
                activeTab === "posts"
                  ? "  border-accent text-text-primary"
                  : "border-transparent text-gray-400"
              } transition-colors`}
            >
              <BsGrid3X3 className="text-xl" />
              <span className="text-sm font-semibold hidden sm:inline">
                POSTS
              </span>
            </button>
            <button
              onClick={() => setActiveTab("vibes")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 border-t-2 cursor-pointer ${
                activeTab === "vibes"
                  ? "border-accent text-text-primary"
                  : "border-transparent text-gray-400"
              } transition-colors`}
            >
              <MdOutlineSlowMotionVideo className="text-2xl" />
              <span className="text-sm font-semibold hidden sm:inline">
                VIBES
              </span>
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 py-3 flex items-center justify-center gap-2 border-t-2 cursor-pointer ${
                  activeTab === "saved"
                    ? "border-accent text-text-primary"
                    : "border-transparent text-gray-400"
                } transition-colors`}
              >
                <BsBookmark className="text-xl" />
                <span className="text-sm font-semibold hidden sm:inline">
                  SAVED
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-1">
          {activeTab === "posts" && (
            <div>
              {profileData?.posts && profileData.posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {/* Sample posts - Replace with actual post images */}
                  {profileData.posts.map((post, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-800 cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center overflow-hidden relative"
                      onClick={() => {
                        setSelectedSource("posts");
                        setSelectedPostIndex(index);
                      }}
                    >
                      {post.mediaType === "video" ? (
                        <video
                          src={post.mediaUrl}
                          className="object-cover w-full h-full"
                          controls
                        />
                      ) : (
                        <img
                          src={post.mediaUrl}
                          alt={`Post ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <BsGrid3X3 className="text-6xl mb-4" />
                  <p className="text-xl font-semibold mb-2">No Posts Yet</p>
                  <p className="text-sm">
                    When you share photos, they'll appear here.
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "vibes" && (
            <div className="flex flex-col items-center justify-center  text-gray-400">
              {profileData?.vibes && profileData.vibes.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {profileData.vibes.map((vibe, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedPostIndex(index);
                        setSelectedSource("vibes");
                      }}
                      className="aspect-square bg-gray-800 cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center overflow-hidden relative"
                    >
                      <video
                        src={vibe.mediaUrl}
                        className="object-cover w-full h-full"
                        controls
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <MdOutlineSlowMotionVideo className="text-6xl mb-4" />
                  <p className="text-xl font-semibold mb-2">No Reels Yet</p>
                  <p className="text-sm">
                    When you share reels, they'll appear here.
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "saved" && (
            <div className="flex flex-col items-center justify-center text-gray-400">
              {profileData?.savedPosts && profileData.savedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {profileData.savedPosts.map((post, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-800 cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center overflow-hidden relative"
                      onClick={() => {
                        setSelectedSource("saved");
                        setSelectedPostIndex(index);
                      }}
                    >
                      {post.mediaType === "video" ? (
                        <video
                          src={post.mediaUrl}
                          className="object-cover w-full h-full"
                          controls
                        />
                      ) : (
                        <img
                          src={post.mediaUrl}
                          alt={`Post ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <BsBookmark className="text-6xl mb-4" />
                  <p className="text-xl font-semibold mb-2">
                    No Saved Posts Yet
                  </p>
                  <p className="text-sm">
                    When you save posts, they'll appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Posts Viewer Modal (Instagram-style) */}
      {selectedSource && selectedPostIndex !== null && getActiveList() && (
        <div
          className="fixed inset-0 bg-black/90 z-9999 flex items-center justify-center px-2"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedSource(null);
              setSelectedPostIndex(null);
            }
          }}
        >
          <div className="max-w-2xl w-full h-[90vh] relative" ref={listRef}>
            <button
              onClick={() => {
                setSelectedSource(null);
                setSelectedPostIndex(null);
              }}
              className="absolute -top-10 right-0 text-3xl text-gray-300 hover:text-white cursor-pointer"
            >
              ×
            </button>
            <div className="h-full overflow-y-auto space-y-6 pt-2 pb-4">
              {getActiveList().map((item, idx) => (
                <div
                  key={item._id || idx}
                  ref={idx === selectedPostIndex ? selectedItemRef : null}
                >
                  {selectedSource === "vibes" ? (
                    <VibeCard vibe={item} />
                  ) : (
                    <Post post={item} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Navbar */}
      <div className="lg:hidden flex items-center justify-center">
        <Navbar />
      </div>

      {showShare && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          contentType="profile"
          contentId={profileData?._id}
        />
      )}
    </div>
  );
}

export default Profile
