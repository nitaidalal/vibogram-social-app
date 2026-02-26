import React from 'react'
import { IoLogOutOutline } from 'react-icons/io5'

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-500/20 p-4 rounded-full">
            <IoLogOutOutline className="text-danger text-4xl" />
          </div>
        </div>
        
        <h3 className="text-text-primary text-xl font-bold text-center mb-2">
          Log Out?
        </h3>
        
        <p className="text-text-secondary text-center mb-6">
          Are you sure you want to log out of your account?
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-surface-hover text-text-primary py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:opacity-90 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
