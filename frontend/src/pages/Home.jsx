import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(clearUserData());
    toast.success('Logged out successfully!');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome to Vibogram! 🎉
              </h1>
              <p className="text-gray-600 mt-2">
                Hello, <span className="font-semibold">{userData?.name || 'User'}</span>!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold text-blue-800 mb-2">User Information:</h2>
            <p className="text-gray-700"><strong>Username:</strong> {userData?.username}</p>
            <p className="text-gray-700"><strong>Email:</strong> {userData?.email}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Authentication is working!</h3>
            <p className="text-gray-700">
              Your login is now persistent. You can refresh the page and you'll stay logged in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
