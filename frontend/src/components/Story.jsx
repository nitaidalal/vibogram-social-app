import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import toast from 'react-hot-toast';
import moment from 'moment';

const Story = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { stories } = useSelector((state) => state.story);
  
  const [currentStory, setCurrentStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const progressInterval = useRef(null);
  const videoRef = useRef(null);

  // Memoize expensive calculations to prevent re-renders
  const allStories = useMemo(() => stories.filter(story => story.author?.username), [stories]);
  const currentIndex = useMemo(() => stories.findIndex(story => story?.author?.username === username), [stories, username]);
  const isOwnStory = useMemo(() => userData?.username === username, [userData?.username, username]);

  useEffect(() => {
    fetchStory();
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [username]);

  useEffect(() => {
    if (currentStory && !isPaused) {
      startProgress();
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentStory, isPaused]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      setProgress(0);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/story/getByUsername/${username}`,
        { withCredentials: true }
      );
      
      setCurrentStory(response.data.story);
    } catch (error) {
      console.error('Error fetching story:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Story not found or expired');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    const duration = currentStory?.mediaType === 'video' ? 15000 : 5000; // 15s for video, 5s for image
    const interval = 50;
    const increment = (interval / duration) * 100;
    
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          handleNext();
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevStory = allStories[currentIndex - 1];
      navigate(`/story/${prevStory.author.username}`);
    } else {
      navigate('/');
    }
  };

  const handleNext = () => {
    if (currentIndex < allStories.length - 1) {
      const nextStory = allStories[currentIndex + 1];
      navigate(`/story/${nextStory.author.username}`);
    } else {
      navigate('/');
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (currentStory?.mediaType === 'video' && videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2">
        <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <img
            src={currentStory.author?.profileImage || '/default-avatar.png'}
            alt={currentStory.author?.name}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="font-semibold">{currentStory.author?.name}</p>
            <p className="text-xs text-gray-300">
              {moment(currentStory.createdAt).fromNow()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isOwnStory && (
            <button 
              onClick={() => setShowViewers(!showViewers)}
              className="text-sm"
            >
              👁️ {currentStory.viewers?.length || 0}
            </button>
          )}
          <button onClick={handleClose}>
            <IoClose className="text-3xl" />
          </button>
        </div>
      </div>

      {/* Navigation - Left side */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 rounded-full p-2 hover:bg-black/50"
        >
          <IoChevronBack className="text-white text-2xl" />
        </button>
      )}

      {/* Navigation - Right side */}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 rounded-full p-2 hover:bg-black/50"
        >
          <IoChevronForward className="text-white text-2xl" />
        </button>
      )}

      {/* Story Content */}
      <div 
        className="relative w-full max-w-lg h-full flex items-center justify-center"
        onClick={handlePauseResume}
      >
        {currentStory.mediaType === 'image' ? (
          <img
            src={currentStory.mediaUrl}
            alt="Story"
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={currentStory.mediaUrl}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            onEnded={handleNext}
          />
        )}
      </div>

      {/* Viewers Modal */}
      {showViewers && isOwnStory && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-20 max-h-[60vh] overflow-y-auto rounded-t-3xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Viewers ({currentStory.viewers?.length || 0})
              </h3>
              <button onClick={() => setShowViewers(false)}>
                <IoClose className="text-white text-2xl" />
              </button>
            </div>
            
            <div className="space-y-3">
              {currentStory.viewers && currentStory.viewers.length > 0 ? (
                currentStory.viewers.map((viewer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={viewer.profileImage || '/default-avatar.png'}
                      alt={viewer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-medium">{viewer.name}</p>
                      <p className="text-gray-400 text-sm">@{viewer.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No viewers yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Story;
