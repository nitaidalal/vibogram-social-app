import { CiHeart } from "react-icons/ci";
import { FaUserLarge } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUserData } from "../redux/userSlice";
import axios from "axios";

const LeftHome = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

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
  return (
    <div className="w-[25%] hidden lg:block border-r-2 bg-dark-bg px-4 text-dark-text border-gray-700 min-h-screen">
      <div className="flex  justify-between items-center h-25 ">
        <div className="flex gap-3">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 " />
          <span className="text-primary text-4xl font-bold ">Vibogram</span>
        </div>
        <div>
          <CiHeart className="text-4xl" />
        </div>
      </div>
      {/* user photo and name and id*/}
      <div className="flex items-center gap-[10px]">
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
             className="px-3 py-2 bg-rose-500 text-white cursor-pointer rounded-md" >Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default LeftHome;
