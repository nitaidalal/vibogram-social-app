import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { LuSearch, LuX } from 'react-icons/lu';
import { FiSend } from 'react-icons/fi';
import { FaUserLarge } from 'react-icons/fa6';


const BASE = import.meta.env.VITE_BACKEND_URL;

const ShareModal = ({ isOpen, onClose, contentType, contentId }) => {
  const [composeSearch, setComposeSearch] = useState('');
  const [composeResults, setComposeResults] = useState([]);
  const [composeLoading, setComposeLoading] = useState(false);
  const [sendingTo, setSendingTo] = useState(null);

  const { suggestedUsers } = useSelector((s) => s.user);

  const handleShare = async (receiverId) => {
    try {
      setSendingTo(receiverId);
      await axios.post(
        `${BASE}/messages/share/${receiverId}`,
        { contentType, contentId },
        { withCredentials: true },
      );
      toast.success('Sent!');
      setTimeout(() => onClose(), 200);
    } catch {
      toast.error('Failed to share. Try again.');
    } finally {
      setSendingTo(null);
    }
  };

  // ── Reset search when modal closes ──
  useEffect(() => {
    if (!isOpen) {
      setComposeSearch('');
      setComposeResults([]);
    }
  }, [isOpen]);

  // ── Debounced user search ──
  useEffect(() => {
    if (!composeSearch.trim()) {
      setComposeResults([]);
      setComposeLoading(false);
      return;
    }
    // Set loading immediately so the spinner shows during the debounce delay
    setComposeLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${BASE}/user/search?query=${composeSearch}`,
          { withCredentials: true },
        );
        setComposeResults(data.users || data || []);
      } catch {
        setComposeResults(
          suggestedUsers.filter(
            (u) =>
              u.name?.toLowerCase().includes(composeSearch.toLowerCase()) ||
              u.username?.toLowerCase().includes(composeSearch.toLowerCase()),
          ),
        );
      } finally {
        setComposeLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [composeSearch, suggestedUsers]);

  if (!isOpen) return null;

  const displayUsers = composeSearch ? composeResults : suggestedUsers;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-linear-to-r from-purple-500/10 to-pink-500/10">
          <h3 className="text-text-primary font-bold text-base">
            Share {contentType.charAt(0).toUpperCase() + contentType.slice(1)} 
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-surface"
          >
            <LuX className="text-xl" />
          </button>
        </div>

        {/* ── Search ── */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
            <input
              autoFocus
              value={composeSearch}
              onChange={(e) => setComposeSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* ── User List ── */}
        <div className="max-h-72 overflow-y-auto">
          {/* Loading spinner */}
          {}

          {/* No results */}
          {!composeLoading && composeSearch && composeResults.length === 0 && (
            <p className="text-text-muted text-sm text-center py-6">
              No users found
            </p>
          )}

          {/* Section label when showing suggestions */}
          {!composeSearch && suggestedUsers.length > 0 && (
            <p className="text-text-muted text-xs px-4 pt-3 pb-1 font-semibold uppercase tracking-wide">
              Suggested
            </p>
          )}

          {/* Empty suggestions */}
          {!composeSearch && suggestedUsers.length === 0 && (
            <p className="text-text-muted text-sm text-center py-6">
              No suggestions available
            </p>
          )}

          {/* User rows */}
          {composeLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            displayUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserLarge className="text-white text-sm" />
                  )}
                </div>

                {/* Name & username */}
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-semibold text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-text-muted text-xs truncate">
                    @{user.username}
                  </p>
                </div>

                {/* Send button */}
                <button
                  onClick={() => handleShare(user._id)}
                  disabled={sendingTo !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {sendingTo === user._id ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend className="text-xs" />
                      Send
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ShareModal;
