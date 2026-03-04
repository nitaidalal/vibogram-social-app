import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { IoSearchOutline, IoCloseCircle, IoArrowBackOutline } from 'react-icons/io5'
import { FaUserLarge } from 'react-icons/fa6'
import Follow from '../components/Resuable/Follow'
import Loader from '../components/Loader'

const Search = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) { //
      setResults([])
      setSearched(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(query.trim())
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSearch = async (q) => {
    try {
      setLoading(true)
      setSearched(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/search/${encodeURIComponent(q)}`,
        {},
        { withCredentials: true }
      )
      // Exclude current user from results
      setResults(res.data.users)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSearched(false)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary sm:ml-[72px] lg:ml-[240px]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-bg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-text-primary hover:text-primary transition-colors cursor-pointer p-1 rounded-full hover:bg-surface"
          >
            <IoArrowBackOutline className="text-2xl" />
          </button>

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 focus-within:border-primary transition-colors duration-200"> 
            <IoSearchOutline className="text-text-muted text-xl shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people..."
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-muted text-sm"
            />
            {query && (
              <button onClick={clearSearch} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                <IoCloseCircle className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center mt-12">
            <Loader />
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-text-muted text-xs mb-2 ml-1">
              {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
            {results.map((user) => (
              <UserCard key={user._id} user={user} navigate={navigate} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && searched && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center">
              <IoSearchOutline className="text-4xl text-text-muted" />
            </div>
            <div>
              <p className="text-text-primary font-semibold text-lg">No results for &quot;{query}&quot;</p>
              <p className="text-text-secondary text-sm mt-1">Try a different name or username</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center">
              <IoSearchOutline className="text-4xl text-text-muted" />
            </div>
            <div>
              <p className="text-text-primary font-semibold text-lg">Search for people</p>
              <p className="text-text-secondary text-sm mt-1">Find friends by name or username</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const UserCard = ({ user, navigate }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors duration-150 cursor-pointer group">
      {/* Avatar */}
      <div
        onClick={() => navigate(`/profile/${user.username}`)}
        className="h-12 w-12 rounded-full overflow-hidden border border-border shrink-0 bg-surface flex items-center justify-center"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <FaUserLarge className="text-text-muted text-lg" />
        )}
      </div>

      {/* Info */}
      <div
        className="flex-1 min-w-0"
        onClick={() => navigate(`/profile/${user.username}`)}
      >
        <p className="text-text-primary font-semibold text-sm truncate group-hover:text-primary transition-colors">
          {user.name}
        </p>
        <p className="text-text-secondary text-xs truncate">@{user.username}</p>
      </div>

      {/* Follow Button */}
      <div onClick={(e) => e.stopPropagation()}>
        {user._id !== userData?._id && <Follow userId={user._id} />}
      </div>
    </div>
  )
}

export default Search
