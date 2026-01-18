import { useState, useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../redux/userSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUserLarge } from "react-icons/fa6";
import { BsGrid3X3 } from "react-icons/bs";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Navbar from '../components/navbar';
import Loader from '../components/Loader';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const { profileData, userData } = useSelector((state) => state.user);

  const isOwnProfile = userData?.username === username;

  const handleProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile/${username}`, { withCredentials: true });
      dispatch(setProfileData(response.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (username) {
      handleProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-dark-bg text-dark-text flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full sm:max-w-3xl md:max-w-4xl mx-auto min-h-screen bg-dark-bg text-dark-text pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark-bg border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-2xl">
          ←
        </button>
        <h1 className="text-xl font-semibold">{profileData?.username}</h1>
        <button className="text-2xl">
          {isOwnProfile && <IoMdSettings />}
        </button>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 py-6">
        {/* Profile Picture and Stats */}
        <div className="flex items-center gap-6 mb-6">
          {/* Profile Picture */}
          <div className="shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-2 border-primary flex justify-center items-center bg-gray-700">
              {profileData?.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt={profileData.name}
                  className="object-cover h-full w-full"
                />
              ) : (
                <FaUserLarge className="text-white text-4xl md:text-5xl" />
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-around text-center">
            <div>
              <p className="text-xl md:text-2xl font-bold">{profileData?.posts?.length || 0}</p>
              <p className="text-sm text-gray-400">Posts</p>
            </div>
            <div className="cursor-pointer">
              <p className="text-xl md:text-2xl font-bold">{profileData?.followers?.length || 0}</p>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div className="cursor-pointer">
              <p className="text-xl md:text-2xl font-bold">{profileData?.following?.length || 0}</p>
              <p className="text-sm text-gray-400">Following</p>
            </div>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg">{profileData?.name}</h2>
          {profileData?.bio && (
            <p className="text-sm text-gray-300 mt-1">{profileData.bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isOwnProfile ? (
            <>
              <button 
                onClick={() => navigate('/edit-profile')}
                className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
              <button className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Share Profile
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Follow
              </button>
              <button className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Message
              </button>
              
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-t-2 ${
              activeTab === 'posts'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400'
            } transition-colors`}
          >
            <BsGrid3X3 className="text-xl" />
            <span className="text-sm font-semibold hidden sm:inline">POSTS</span>
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-t-2 ${
              activeTab === 'reels'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400'
            } transition-colors`}
          >
            <MdOutlineSlowMotionVideo className="text-2xl" />
            <span className="text-sm font-semibold hidden sm:inline">REELS</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-1">
        {activeTab === 'posts' ? (
          <div>
            {profileData?.posts && profileData.posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {/* Sample posts - Replace with actual post images */}
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-800 cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <BsGrid3X3 className="text-6xl mb-4" />
                <p className="text-xl font-semibold mb-2">No Posts Yet</p>
                <p className="text-sm">When you share photos, they'll appear here.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <MdOutlineSlowMotionVideo className="text-6xl mb-4" />
            <p className="text-xl font-semibold mb-2">No Reels Yet</p>
            <p className="text-sm">When you share reels, they'll appear here.</p>
          </div>
        )}
      </div>

      {/* Navbar */}
      <div className="lg:hidden flex items-center justify-center">
        <Navbar />
      </div>
    </div>
  )
}

export default Profile
