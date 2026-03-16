import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LuArrowLeft } from 'react-icons/lu'
import VibeCard from '../components/VibeCard'

const VibePage = () => {
  const { vibeId } = useParams()
  const navigate = useNavigate()
  const [vibe, setVibe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVibe = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vibes/${vibeId}`, { withCredentials: true })
        setVibe(response.data.vibe)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load vibe')
      } finally {
        setLoading(false)
      }
    }
    fetchVibe()
  }, [vibeId])

  return (
    <div className="sm:ml-[72px] lg:ml-[240px]  h-screen  overflow-hidden relative bg-bg">
      {/* Floating back button over the video */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/60 text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors cursor-pointer"
      >
        <LuArrowLeft />
        Back
      </button>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : vibe ? (
        <div className="w-full h-screen max-w-md mx-auto">
          <VibeCard vibe={vibe} refreshVibes={() => {}} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-lg">Vibe not found.</p>
        </div>
      )}
    </div>
  );
}

export default VibePage
