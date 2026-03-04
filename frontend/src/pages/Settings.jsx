import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserData } from '../redux/userSlice'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { toggleTheme } from '../redux/themeSlice'

// Icons
import { 
  IoPersonOutline, IoLockClosedOutline, 
  IoShieldCheckmarkOutline, IoHelpCircleOutline, IoInformationCircleOutline, 
  IoLogOutOutline, IoKeyOutline, IoGlobeOutline, 
  IoMoonOutline, IoSunnyOutline 
} from 'react-icons/io5'
import { MdPrivacyTip, MdReportProblem } from 'react-icons/md'

// Components
import SettingsSection from '../components/settings/SettingsSection'
import SettingsItem from '../components/settings/SettingsItem'
import LogoutModal from '../components/settings/LogoutModal'
import ChangePasswordModal from '../components/settings/ChangePasswordModal'

const Settings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const { theme } = useSelector((state) => state.theme)
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showPasswordDialogue, setShowPasswordDialogue] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
        {},
        { withCredentials: true }
      )
      dispatch(clearUserData())
      toast.success('Logged out successfully')
      navigate('/signin')
    } catch (error) {
      console.error("Logout error:", error)
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary sm:ml-[72px] lg:ml-[240px]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-text-primary text-2xl cursor-pointer hover:scale-110 transition-transform"
          >
            ←
          </button>
          <div>
            <h1 className="text-text-primary text-xl font-semibold">Settings</h1>
            <p className="text-text-secondary text-sm">@{userData?.username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon={IoPersonOutline}
            title="Edit Profile"
            subtitle="Change your name, bio, and profile picture"
            onClick={() => navigate("/edit-profile")}
          />
          <SettingsItem
            icon={IoKeyOutline}
            title="Change Password"
            subtitle="Update your password"
            onClick={() => setShowPasswordDialogue(true)}
          />
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon={MdPrivacyTip}
            title="Account Privacy"
            subtitle="Manage who can see your content"
            onClick={() => toast("Feature coming soon")}
          />
          <SettingsItem
            icon={IoShieldCheckmarkOutline}
            title="Story Settings"
            subtitle="Control who can view your stories"
            onClick={() => toast("Feature coming soon")}
          />
          <SettingsItem
            icon={IoLockClosedOutline}
            title="Blocked Accounts"
            subtitle="Manage blocked users"
            onClick={() => toast("Feature coming soon")}
          />
        </SettingsSection>

        {/* Notifications Section */}
        {/* <SettingsSection title="Notifications">
          <SettingsItem
            icon={IoNotificationsOutline}
            title="Push Notifications"
            subtitle="Manage notification preferences"
            onClick={() => toast("Feature coming soon")}
          />
          <SettingsItem
            icon={IoMailOutline}
            title="Email Notifications"
            subtitle="Control email updates"
            onClick={() => toast("Feature coming soon")}
          />
        </SettingsSection> */}

        {/* Display & Accessibility */}
        <SettingsSection title="Display & Accessibility">
          <SettingsItem
            icon={theme === "dark" ? IoMoonOutline : IoSunnyOutline}
            title="Theme"
            subtitle={`Currently using ${theme === "dark" ? "Dark" : "Light"} mode`}
            onClick={() => dispatch(toggleTheme())}
          />
          <SettingsItem
            icon={IoGlobeOutline}
            title="Language"
            subtitle="English (US)"
            onClick={() => toast("Feature coming soon")}
          />
        </SettingsSection>

        {/* Help & Support Section */}
        <SettingsSection title="Help & Support">
          <SettingsItem
            icon={IoHelpCircleOutline}
            title="Help Center"
            subtitle="Get help with your account"
            onClick={() => toast("Feature coming soon")}
          />
          <SettingsItem
            icon={MdReportProblem}
            title="Report a Problem"
            danger={true}
            subtitle="Let us know if something isn't working"
            onClick={() => toast("Feature coming soon")}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem
            icon={IoInformationCircleOutline}
            title="Terms of Service"
            subtitle="Read our terms"
            onClick={() => toast("Feature coming soon")}
          />
          <SettingsItem
            icon={MdPrivacyTip}
            title="Privacy Policy"
            subtitle="How we handle your data"
            onClick={() => toast("Feature coming soon")}
          />
          
        </SettingsSection>

        {/* Logout Button */}
        <div className="mb-6">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <SettingsItem
              icon={IoLogOutOutline}
              title="Log Out"
              onClick={() => setShowLogoutConfirm(true)}
              danger={true}
              showArrow={false}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <LogoutModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
      
      <ChangePasswordModal
        isOpen={showPasswordDialogue}
        onClose={() => setShowPasswordDialogue(false)}
      />
    </div>
  )
}

export default Settings
