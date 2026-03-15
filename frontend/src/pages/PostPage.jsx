import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LuArrowLeft } from 'react-icons/lu'
import Post from '../components/Post'

const PostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`, { withCredentials: true })
      .then(({ data }) => setPost(data.post))
      .catch(() => toast.error('Post not found'))
      .finally(() => setLoading(false))
  }, [postId])

  return (
    <div className="min-h-screen bg-bg text-text-primary sm:ml-[72px] lg:ml-[240px]">
      <div className="max-w-xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-5 transition-colors cursor-pointer"
        >
          <LuArrowLeft className="text-xl" />
          <span className="font-medium">Back</span>
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : post ? (
          <Post post={post} />
        ) : (
          <p className="text-center text-text-muted py-20">Post not found.</p>
        )}
      </div>
    </div>
  )
}

export default PostPage
