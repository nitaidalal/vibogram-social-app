import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Search from './pages/Search'
import AppLayout from './components/AppLayout'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import UploadPost from './pages/UploadPost'
import Vibes from './pages/Vibes'
import Settings from './pages/Settings'
import Story from './components/Story'
import getSuggestedUsers from './hooks/getSuggestedUsers'
import Messages from './pages/Messages'
import useInitSocket from './hooks/useInitSocket'
import Notifications from './pages/Notifications'
import useGetNotifications from './hooks/useGetNotifications'
import { useEffect } from 'react'

const App = () => {

  const {userData} = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  
  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  getSuggestedUsers();
  useGetCurrentUser();
  useInitSocket();
  useGetNotifications();
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 60,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "#d1fae5",
              color: "#065f46",
              border: "1px solid #10b981",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#fee2e2",
              color: "#7f1d1d",
              border: "1px solid #ef4444",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
          loading: {
            style: {
              background: "#dbeafe",
              color: "#1e3a8a",
              border: "1px solid #3b82f6",
            },
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <Routes>
        {/* Public routes — no sidebar */}
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Authenticated routes — AppLayout renders LeftHome sidebar for desktop */}
        <Route element={userData ? <AppLayout /> : <Navigate to="/signin" />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/upload" element={<UploadPost />} />
          <Route path="/upload-story" element={<UploadPost isStory={true} />} />
          <Route path="/story/:username" element={<Story />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/vibes" element={<Vibes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
