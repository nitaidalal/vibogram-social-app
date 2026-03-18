import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getSocket } from "../socket/socket";
import { BsThreeDots } from "react-icons/bs";
import {
    setConversations,
    setSelectedConversation,
    setMessages,
    addMessage,
    removeUnreadSender,
    markMessagesSeen,
    setLoading,
    removeConversation,
    updateConversationLastMessage,
} from "../redux/messageSlice";
import {
    LuSend,
    LuImage,
    LuPhone,
    LuVideo,
    LuInfo,
    LuArrowLeft,
    LuSearch,
    LuMessageSquare,
    LuX,
} from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckAll, BsCheck, BsPlus } from "react-icons/bs";
import ChatSkeleton from "../skeletons/ChatSkeleton";

const BASE = import.meta.env.VITE_BACKEND_URL;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const currentYear = new Date().getFullYear();

  const messageYear = date.getFullYear();

  if (messageYear === currentYear) {
    // same year → show only month + day
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // different year → show month + day + year
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ src, name, size = "md", isOnline }) => {
    const sizes = { sm: "w-8 h-8 text-xs", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-base" };
    const dotSizes = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-3.5 h-3.5" };
    return (
        <div className="relative flex-shrink-0">
            {src ? (
                <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
            ) : (
                <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold`}>
                    {name?.[0]?.toUpperCase()}
                </div>
            )}
            {isOnline && (
                <span className={`${dotSizes[size]} absolute bottom-0 right-0 bg-success rounded-full border-2 border-bg`} />
            )}
        </div>
    );
};

const MessageBubble = ({ msg, isMine, onDelete }) => {
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();

    const renderContent = () => {
        // ── Shared Post or Vibe ──
        if (msg.messageType === "sharedPost" || msg.messageType === "sharedVibe") {
            const content = msg.sharedPost || msg.sharedVibe;
            const label = msg.messageType === "sharedPost" ? "Post" : "Vibe";

            if (!content) {
                return (
                    <div className={`rounded-2xl border border-border px-4 py-3 text-sm text-text-muted max-w-[260px] ${isMine ? "bg-primary/10" : "bg-surface"}`}>
                        This {label.toLowerCase()} is no longer available.
                    </div>
                );
            }

            return (
              <div
                className={`rounded-2xl overflow-hidden border shadow-sm max-w-[260px] ${isMine ? "border-primary/30 bg-primary/5" : "border-border bg-surface"}`}
              >
                {content.mediaUrl &&
                  (content.mediaType === "video" ||
                  msg.messageType === "sharedVibe" ? (
                    <video
                      src={content.mediaUrl}
                      className="w-full max-h-48 object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={content.mediaUrl}
                      alt={label}
                      className="w-full max-h-48 object-cover"
                    />
                  ))}
                <div className="px-3 py-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    {content.author?.profileImage ? (
                      <img
                        src={content.author.profileImage}
                        alt={content.author?.username}
                        className="w-5 h-5 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-linear-to-br from-purple-500 to-pink-500 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-text-primary truncate">
                      @{content.author?.username}
                    </span>
                    <span className="text-[10px] text-text-muted ml-auto shrink-0">
                      {label}
                    </span>
                  </div>
                  {content.caption && (
                    <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                      {content.caption}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      navigate(
                        msg.messageType === "sharedPost"
                          ? `/post/${content._id}`
                          : `/vibe/${content._id}`,
                      )
                    }
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View {label} &rarr;
                  </button>
                </div>
              </div>
            );
        }

        // ── Shared Profile ──
        if (msg.messageType === "sharedProfile") {
            const profile = msg.sharedProfile;

            if (!profile) {
                return (
                    <div className={`rounded-2xl border border-border px-4 py-3 text-sm text-text-muted max-w-[260px] ${isMine ? "bg-primary/10" : "bg-surface"}`}>
                        This profile is no longer available.
                    </div>
                );
            }

            return (
                <div className={`rounded-2xl overflow-hidden border shadow-sm max-w-[260px] ${isMine ? "border-primary/30 bg-primary/5" : "border-border bg-surface"}`}>
                    <div className="flex items-center gap-3 px-3 py-3">
                        {profile.profileImage ? (
                            <img src={profile.profileImage} alt={profile.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 shrink-0 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{profile.name?.[0]?.toUpperCase()}</span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{profile.name}</p>
                            <p className="text-xs text-text-muted truncate">@{profile.username}</p>
                        </div>
                    </div>
                    <div className="px-3 pb-3">
                        <button
                            onClick={() => navigate(`/profile/${profile.username}`)}
                            className="text-xs font-semibold text-primary hover:underline"
                        >
                            View Profile &rarr;
                        </button>
                    </div>
                </div>
            );
        }

        // ── Image + Caption (WhatsApp-style) ──
        if (msg.messageType === "text_image") {
            return (
                <div className={`rounded-2xl overflow-hidden text-sm shadow-sm [overflow-wrap:anywhere] ${isMine ? "bg-primary text-white rounded-br-sm border border-primary" : "bg-surface text-text-primary border border-border rounded-bl-sm"}`}>
                    <img src={msg.image} alt="sent" className="w-full max-h-72 object-cover" />
                    <p className="px-3 py-2 leading-relaxed">{msg.content}</p>
                </div>
            );
        }

        // ── Image only ──
        if (msg.messageType === "image") {
            return (
                <img src={msg.image} alt="sent" className="max-w-full rounded-2xl max-h-72 object-cover shadow" />
            );
        }

        // ── Text only ──
        return (
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed [overflow-wrap:anywhere] shadow-sm ${isMine ? "bg-primary text-white rounded-br-sm" : "bg-surface text-text-primary border border-border rounded-bl-sm"}`}>
                {msg.content}
            </div>
        );
    };

    return (
      <div
        className={`flex gap-2 mb-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={`flex flex-col max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>
          {renderContent()}
          <div className="flex items-center gap-1 mt-0.5 px-1">
            <span className="text-[10px] text-text-muted">
              {formatTime(msg.createdAt)}
            </span>
            {isMine &&
              (msg.seen ? (
                <BsCheckAll className="text-primary text-sm" />
              ) : (
                <BsCheck className="text-text-muted text-sm" />
              ))}
          </div>
        </div>
        {isMine && hover && (
          <button
            onClick={() => onDelete(msg._id)}
            className="text-danger p-1"
          >
            <AiOutlineDelete className="text-sm" />
          </button>
        )}
      </div>
    );
};



const DateSeparator = ({ date }) => (
    <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted font-medium px-2">{formatDate(date)}</span>
        <div className="flex-1 h-px bg-border" />
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
        <div className="w-20 h-20 rounded-full bg-surface border-2 border-border flex items-center justify-center">
            <LuMessageSquare className="text-4xl text-text-muted" />
        </div>
        <div>
            <p className="text-text-primary font-semibold text-lg">Your Messages</p>
            <p className="text-text-secondary text-sm mt-1">Send a message to start a conversation</p>
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Messages = () => {
  const dispatch = useDispatch();
  const { userData, suggestedUsers } = useSelector((s) => s.user);
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    unreadSenders,
  } = useSelector((s) => s.message);
  const { onlineUsers, typingUserId } = useSelector((s) => s.socket);

  const location = useLocation();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"
  const [showCompose, setShowCompose] = useState(false);
  const [composeSearch, setComposeSearch] = useState("");
  const [composeResults, setComposeResults] = useState([]);
  const [composeLoading, setComposeLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Open a chat with a user (used by profile nav + compose modal) ──
  const openChatWith = useCallback(
    (user) => {
      dispatch(setSelectedConversation({ _id: null, participant: user }));
      dispatch(setMessages([]));
      dispatch(removeUnreadSender(user._id));
      setMobileView("chat");
    },
    [dispatch],
  );

  // ── Handle navigation from Profile "Message" button ──
  useEffect(() => {
    if (location.state?.user) openChatWith(location.state.user);
  }, [location.state, openChatWith]);

  // ── Clear state when leaving the messages page ──
  useEffect(() => {
    return () => {
      dispatch(setSelectedConversation(null));
      dispatch(setMessages([]));
    };
  }, []);

  // ── Debounced search for compose modal ──
  useEffect(() => {
    if (!composeSearch.trim()) {
      setComposeResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setComposeLoading(true);
      try {
        const { data } = await axios.get(
          `${BASE}/user/search?query=${composeSearch}`,
          {
            withCredentials: true,
          },
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
  }, [composeSearch]);

  // ── Fetch all conversations ──
  // wrapped in useCallback to avoid re-creating on every render (used in useEffect)
  const fetchConversations = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.get(`${BASE}/messages/conversations`, {
        withCredentials: true,
      });
      dispatch(setConversations(data));
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ── If selectedConversation has no _id yet (new chat), upgrade it once conversations load ──
  useEffect(() => {
    if (
      !selectedConversation ||
      selectedConversation._id ||
      conversations.length === 0
    )
      return;
    const existing = conversations.find(
      (c) => c.participant?._id === selectedConversation.participant?._id,
    );
    if (existing) dispatch(setSelectedConversation(existing));
  }, [conversations, selectedConversation, dispatch]);

  // ── Auto-focus input when a conversation is selected ──
  useEffect(() => {
    if (!selectedConversation) return;
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [selectedConversation?._id]);

  // ── Fetch messages for the selected conversation ──
  useEffect(() => {
    if (!selectedConversation?._id) return;
    const fetchMessages = async () => {
      try {
        setMessageLoading(true);
        const { data } = await axios.get(
          `${BASE}/messages/${selectedConversation._id}`,
          {
            withCredentials: true,
          },
        );
        dispatch(setMessages(data));
      } catch (err) {
        console.error(err);
      } finally {
        setMessageLoading(false);
      }
    };
    fetchMessages();
  }, [selectedConversation?._id, dispatch]);

  // ── Auto-scroll to latest message ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Mark messages as seen ──
  useEffect(() => {
    const socket = getSocket();
    if (
      !socket ||
      !selectedConversation?._id ||
      messages.length === 0 ||
      mobileView !== "chat"
    )
      return;

    const hasUnseen = messages.some(
      (msg) => msg.sender?._id !== userData?._id && !msg.seen,
    );

    if (hasUnseen) {
      socket.emit("markSeen", {
        conversationId: selectedConversation._id,
        senderId: selectedConversation.participant._id,
      });
      dispatch(markMessagesSeen({ conversationId: selectedConversation._id }));
    }
  }, [messages, selectedConversation?._id, mobileView]);

  // ── Handlers ──

  const clearImageState = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = null; // allow re-selecting the same file
  };

  const handleSend = async () => {
    if (!text.trim() && !imagePreview) return;
    if (!selectedConversation) return;

    setSending(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append("content", text.trim());
      if (imageFile) formData.append("image", imageFile);

      const { data } = await axios.post(
        `${BASE}/messages/send/${selectedConversation.participant._id}`,
        formData,
        { withCredentials: true },
      );

      dispatch(addMessage(data));
      dispatch(updateConversationLastMessage(data));

      // If brand-new conversation, update selectedConversation with the real _id right away
      // (avoids a race condition if user sends another message before fetchConversations resolves)
      if (!selectedConversation._id) {
        dispatch(
          setSelectedConversation({
            ...selectedConversation,
            _id: data.conversationId,
          }),
        );
        fetchConversations(); // needed only for brand-new conversations to get the full conv object
      }

      setText("");
      clearImageState();
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`${BASE}/messages/${messageId}`, {
        withCredentials: true,
      });
      dispatch(setMessages(messages.filter((m) => m._id !== messageId)));
    } catch (err) {
      console.error(err);
    }
  };

  const selectConversation = (conv) => {
    dispatch(setSelectedConversation(conv));
    dispatch(removeUnreadSender(conv.participant._id));
    setMobileView("chat");
    clearImageState();
  };

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    try {
      await axios.delete(`${BASE}/messages/conversations/${conversationId}`, {
        withCredentials: true,
      });
      dispatch(removeConversation(conversationId));
      setMobileView("list");
    } catch (err) {
      toast.error("Failed to delete conversation");
      console.error(err);
    }
  };

  // ── Derived state ──

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.participant?.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-120px)] sm:h-screen bg-bg">
      {/* ════ Compose Modal ════ */}
      {showCompose && (
        <div
          onClick={() => setShowCompose(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-bg border border-border rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-text-primary font-semibold">
                New Message
              </span>
              <button
                onClick={() => {
                  setShowCompose(false);
                  setComposeSearch("");
                  setComposeResults([]);
                }}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <LuX className="text-xl" />
              </button>
            </div>
            {/* Search */}
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
            {/* Results */}
            <div className="max-h-72 overflow-y-auto">
              {composeLoading && (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!composeLoading &&
                composeSearch &&
                composeResults.length === 0 && (
                  <p className="text-text-muted text-sm text-center py-6">
                    No users found
                  </p>
                )}
              {!composeSearch && suggestedUsers.length > 0 && (
                <p className="text-text-muted text-xs px-4 pt-3 pb-1">
                  Suggested
                </p>
              )}
              {(composeSearch ? composeResults : suggestedUsers).map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    openChatWith(user);
                    setShowCompose(false);
                    setComposeSearch("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface cursor-pointer transition-colors"
                >
                  <Avatar
                    src={user.profileImage}
                    name={user.name}
                    size="sm"
                    isOnline={onlineUsers.includes(user._id)}
                  />
                  <div>
                    <p className="text-text-primary font-semibold text-sm">
                      {user.name}
                    </p>
                    <p className="text-text-muted text-xs">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="flex flex-1 h-full overflow-hidden ml-0 sm:ml-[72px] lg:ml-[240px]">
        {/* ════ LEFT PANEL — Conversations ════ */}
        <div
          className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-border bg-bg flex flex-col ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}
        >
          {/* Header */}
          <div className="px-4 pt-6 pb-3 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-primary font-bold text-xl">
                {userData?.username}
              </span>
              <button
                onClick={() => setShowCompose(true)}
                className="text-text-primary hover:text-primary transition-colors p-1"
                title="New message"
              >
                <BsPlus className="text-xl" />
              </button>
            </div>
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Conversation list */}
          {loading ? (
            <div className="flex justify-center mt-12">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-muted text-sm gap-2">
                  <LuMessageSquare className="text-3xl" />
                  <span>No conversations yet</span>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isOnline = onlineUsers.includes(conv.participant?._id);
                  const isSelected = selectedConversation?._id === conv._id;
                  const isUnread = unreadSenders.includes(
                    conv.participant?._id,
                  );
                  return (
                    <div
                      key={conv._id}
                      onClick={() => selectConversation(conv)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? "bg-surface-hover" : "hover:bg-surface"}`}
                    >
                      <Avatar
                        src={conv.participant?.profileImage}
                        name={conv.participant?.name}
                        isOnline={isOnline}
                        delete={conv.participant?._id === userData?._id} //
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <span
                              className={`text-sm truncate ${isUnread ? "text-text-primary font-bold" : "text-text-primary font-semibold"}`}
                            >
                              {conv.participant?.name}
                            </span>
                            {conv.lastMessage && (
                              <span className="text-[11px] text-text-muted flex-shrink-0 ml-2">
                                {formatTime(conv.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="relative group ">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-text-secondary hover:text-text-primary transition-colors"
                            >
                              <BsThreeDots className="text-lg" />
                            </button>
                            {/* Dropdown */}
                            <div className="absolute  right-0 top-5 hidden group-focus-within:block bg-surface border border-border rounded-xl shadow-lg z-10 min-w-[140px] py-1">
                              <button
                                onClick={(e) =>
                                  handleDeleteConversation(e, conv._id)
                                }
                                className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface-hover  border-b border-border transition-colors"
                              >
                                Delete for me
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors">
                                Block user
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p
                            className={`text-xs truncate flex-1 ${isUnread ? "text-text-primary font-medium" : "text-text-muted"}`}
                          >
                            {conv.lastMessage?.messageType === "sharedPost" ? "📷 Shared a post" :
                              conv.lastMessage?.messageType === "sharedVibe" ? "🎬 Shared a vibe" :
                              conv.lastMessage?.messageType === "sharedProfile" ? "👤 Shared a profile" :
                              conv.lastMessage?.image ? "📷 Photo" :
                              conv.lastMessage?.content || "Start a conversation"}
                          </p>
                          {isUnread && (
                            <span className=" w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ════ RIGHT PANEL — Chat Window ════ */}
        <div
          className={`flex-1 flex flex-col bg-bg w-full ${mobileView === "list" ? "hidden md:flex" : "flex"}`}
        >
          {!selectedConversation ? (
            <EmptyState />
          ) : (
            <>
              {/* ── Chat Header ── */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg">
                <button
                  className="md:hidden text-text-primary p-1"
                  onClick={() => setMobileView("list")}
                >
                  <LuArrowLeft className="text-xl" />
                </button>
                <Avatar
                  src={selectedConversation.participant?.profileImage}
                  name={selectedConversation.participant?.name}
                  isOnline={onlineUsers.includes(
                    selectedConversation.participant?._id,
                  )}
                  size="md"
                />
                <div className="flex-1">
                  <p className="text-text-primary font-semibold text-sm">
                    {selectedConversation.participant?.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {onlineUsers.includes(selectedConversation.participant?._id)
                      ? "Active now"
                      : `@${selectedConversation.participant?.username}`}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-text-secondary">
                  <button className="hover:text-text-primary transition-colors">
                    <LuPhone className="text-xl" />
                  </button>
                  <button className="hover:text-text-primary transition-colors">
                    <LuVideo className="text-xl" />
                  </button>
                  <button className="hover:text-text-primary transition-colors">
                    <LuInfo className="text-xl" />
                  </button>
                </div>
              </div>

              {/* ── Messages Area ── */}
              {messageLoading ? (
                <ChatSkeleton />
              ) : (
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
                  {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                      <DateSeparator date={date} />
                      {msgs.map((msg) => (
                        <MessageBubble
                          key={msg._id}
                          msg={msg}
                          isMine={msg.sender._id === userData?._id}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}

              {/* ── Typing Indicator ── */}
              {typingUserId === selectedConversation?.participant?._id && (
                <div className="px-6 pb-3">
                  <div className="flex gap-1 items-center bg-surface border border-border rounded-2xl rounded-bl-sm px-3 py-2 w-fit">
                    <span
                      className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              {/* ── Image Preview ── */}
              {imagePreview && (
                <div className="px-4 pb-2 flex justify-end">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="max-h-48 rounded-xl object-cover border border-border"
                    />
                    <button
                      onClick={clearImageState}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-danger text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* ── Input Bar ── */}
              <div className="px-4 py-3 border-t border-border bg-bg">
                <div
                  className={`flex items-end gap-3 bg-surface border rounded-2xl px-4 py-3 transition-colors ${inputFocused ? "border-primary" : "border-border"}`}
                >
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-text-secondary hover:text-primary transition-colors flex-shrink-0 pb-0.5"
                  >
                    <LuImage className="text-xl" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />

                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => {
                      const value = e.target.value;
                      setText(value);

                      // auto resize
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + "px";

                      const socket = getSocket();
                      const receiverId = selectedConversation?.participant?._id;
                      if (!socket || !receiverId) return;

                      socket.emit("typing", { receiverId });

                      clearTimeout(typingTimeoutRef.current);

                      typingTimeoutRef.current = setTimeout(() => {
                        socket.emit("stopTyping", { receiverId });
                      }, 1500);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Message..."
                    rows={1}
                    className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm focus:outline-none resize-none leading-relaxed"
                    style={{ maxHeight: "120px" }}
                  />

                  <button
                    onClick={handleSend}
                    disabled={sending || (!text.trim() && !imagePreview)}
                    className={`flex-shrink-0 pb-0.5 transition-all ${text.trim() || imagePreview ? "text-primary hover:scale-110" : "text-text-muted cursor-default"}`}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <LuSend className="text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
