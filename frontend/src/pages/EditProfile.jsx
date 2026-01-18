import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { FaUserLarge, FaCamera } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"
import Loader from '../components/Loader'

const EditProfile = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    gender: ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        gender: userData.gender || ''
      })
      setProfileImagePreview(userData.profileImage || '')
    }
  }, [userData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const formDataToSend = new FormData()
      
      if (formData.name) formDataToSend.append('name', formData.name)
      if (formData.username) formDataToSend.append('username', formData.username)
      if (formData.bio) formDataToSend.append('bio', formData.bio)
      if (formData.gender) formDataToSend.append('gender', formData.gender)
      if (profileImage) formDataToSend.append('profileImage', profileImage)

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/update-profile`,
        formDataToSend,
        {
          withCredentials: true,
          
        }
      )

        dispatch(setUserData(response.data.updatedUser))
        toast.success('Profile updated successfully!')
        navigate(`/profile/${response.data.updatedUser.username}`)
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  
 

  return (
    <div className="min-h-screen bg-dark-bg flex justify-center ">
      <div className="w-full max-w-2xl bg-dark-surface rounded-2xl shadow-2xl shadow-purple-900/20 hover:shadow-purple-600/40 hover:shadow-2xl transition-shadow duration-300">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-dark-bg  border-b border-border px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-xl text-gray-400 hover:text-white transition"
            >
              <IoMdClose />
            </button>
            <h1 className="text-lg font-semibold">Edit Profile</h1>
            <div className="w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center py-8 border-b border-gray-700">
            <div className="relative">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-2 border-primary flex justify-center items-center bg-gray-700">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <FaUserLarge className="text-white text-6xl" />
                )}
              </div>
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors"
              >
                <FaCamera className="text-white text-lg" />
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <button
              onClick={() => document.getElementById("profileImage").click()}
              className="mt-4 text-blue-500 font-semibold hover:text-blue-400"
            >
              Change Profile Photo
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="py-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:shadow-md focus:shadow-purple-500/50  transition-all duration-300"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:shadow-md focus:shadow-purple-500/50 transition-all duration-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your username will be visible to others
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write something about yourself..."
                rows="4"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:shadow-md focus:shadow-purple-500/50 transition-all duration-300 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length} / 150 characters
              </p>
            </div>

            {/* Gender */}
            <div className="flex gap-3">
              {["Male", "Female"].map((g) => (
                <label
                  key={g}
                  className={`px-5 py-2 rounded-full border cursor-pointer transition-all duration-300
      ${
        formData.gender === g
          ? "bg-primary text-white border-primary "
          : "border-border text-gray-400 hover:border-primary hover:shadow-md hover:shadow-pink-500/30"
      }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  {g}
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gradient text-white font-semibold py-3 px-6 rounded-lg  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating Profile..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile
