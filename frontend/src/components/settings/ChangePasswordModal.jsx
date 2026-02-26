import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoKeyOutline } from 'react-icons/io5'

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { theme } = useSelector((state) => state.theme)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      )
      
      toast.success(response.data.message)
      onClose()
      navigate(-1)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary/20 p-4 rounded-full">
            <IoKeyOutline className="text-primary text-4xl" />
          </div>
        </div>
        
        <h3 className="text-text-primary text-xl font-bold text-center mb-2">
          Change Password
        </h3>

        <div className="flex flex-col w-full gap-4 mb-6">
          <input 
            type="password"
            placeholder="Current Password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <input 
            type="password"
            placeholder="New Password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" 
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={`flex-1 ${theme === "dark" ? "text-text-primary bg-surface-hover" : "text-white bg-black"} py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50`}
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:opacity-90 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
