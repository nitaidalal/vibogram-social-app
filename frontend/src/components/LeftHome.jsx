import { CiHeart } from "react-icons/ci";
import { FaUserLarge } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUserData } from "../redux/userSlice";
import axios from "axios";
import { useState } from "react";

const LeftHome = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    const { suggestedUsers } = useSelector((state) => state.user);
    const [followingStatus, setFollowingStatus] = useState({});

    const handleLogout = async () => {
      try {
        // pass withCredentials in the axios config (3rd arg) so browser sends cookies
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
          {},
          { withCredentials: true }
        );
        dispatch(clearUserData());
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    const handleFollow = async (userId) => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/follow/${userId}`,
          {},
          { withCredentials: true }
        );
        setFollowingStatus((prev) => ({ ...prev, [userId]: true }));
      } catch (error) {
        console.error('Error following user:', error);
      }
    }
  return (
    <div className="w-[25%] hidden lg:block border-r bg-dark-bg px-4 text-dark-text border-gray-700 h-screen overflow-y-auto fixed left-0 top-0">
      <div className="flex  justify-between items-center h-25 ">
        <div className="flex">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 " />
          <span className="text-primary text-4xl font-bold ">ibogram</span>
        </div>
        <div>
          <CiHeart className="text-4xl" />
        </div>
      </div>
      {/* user photo and name and id*/}
      <div className="flex items-center gap-2.5 ">
        <div className="h-12 w-12 object-cover overflow-hidden rounded-full border-3 border-primary  flex justify-center items-center bg-gray-500">
          {userData && userData.profileImage ? (
            <img
              src={userData?.profileImage}
              alt={userData?.name}
              className=" object-cover h-full w-full"
            />
          ) : (
            <FaUserLarge className="text-white text-3xl" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{userData?.name}</h2>
          <p className="text-sm text-gray-400">@{userData?.username}</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-rose-500 text-white cursor-pointer rounded-md"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* suggested users */}
      <div className="mt-4 pt-4  border-t border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Suggested people</h3>
        <div className="flex flex-col gap-4">
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.slice(0, 3).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 object-cover overflow-hidden rounded-full border-2 border-primary  flex justify-center items-center bg-gray-500">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className=" object-cover h-full w-full"
                      />
                    ) : (
                      <FaUserLarge className="text-white text-2xl" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-md font-medium">{user.name}</h4>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user._id)}
                  disabled={followingStatus[user._id]}
                  className={`px-3 cursor-pointer py-1.5 rounded-full text-sm font-medium transition-colors ${
                    followingStatus[user._id]
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {followingStatus[user._id] ? "Following" : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No suggested users available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftHome;
