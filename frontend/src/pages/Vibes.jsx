import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VibeCard from '../components/VibeCard';
import Navbar from '../components/Navbar';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setVibes } from '../redux/vibeSlice';

const Vibes = () => {
  const dispatch = useDispatch();
  const { vibes } = useSelector((state) => state.vibe);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const getAllVibes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/vibes/getAllVibes`,
        {
          withCredentials: true,
        }
      );
      dispatch(setVibes(response.data.vibes || []));
      console.log('All Vibes:', response.data.vibes);
    } catch (error) {
      console.log('Error fetching vibes:', error?.response?.data?.message);
      dispatch(setVibes([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllVibes();
  }, []);

  const handleNext = () => {
    if (currentIndex < vibes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
        >
          <IoArrowBack className="text-2xl" />
          <span className="font-semibold">Back</span>
        </button>
        <h1 className="text-xl font-bold">Vibes</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Vibes Content */}
      <div className="w-full h-full flex items-center justify-center">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
          </div>
        ) : vibes.length > 0 ? (
          <div className="relative w-full h-full max-w-md mx-auto">
            <VibeCard
              vibe={vibes[currentIndex]}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={currentIndex < vibes.length - 1}
              hasPrevious={currentIndex > 0}
              currentIndex={currentIndex}
              totalVibes={vibes.length}
              refreshVibes={getAllVibes}
            />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">No vibes yet!</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to share a vibe
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <Navbar />
      </div>
    </div>
  );
};

export default Vibes;
