import { useState } from 'react';
import { MdPhotoLibrary, MdClose, MdArrowBack } from 'react-icons/md';
import { FaImages, FaClock, FaFire } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadPost = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadTypes = [
    {
      id: 'post',
      title: 'Post',
      description: 'Share moments with your followers',
      icon: FaImages,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500'
    },
    {
      id: 'story',
      title: 'Story',
      description: 'Share for 24 hours',
      icon: FaClock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500'
    },
    {
      id: 'vibe',
      title: 'Vibe',
      description: 'Share your current mood',
      icon: FaFire,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500'
    }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (50 MB for videos, 10 MB for images)
      const maxSize = selectedFile.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      const sizeLabel = selectedFile.type.startsWith('video/') ? '50 MB' : '10 MB';
      
      if (selectedFile.size > maxSize) {
        toast.error(`File size is too large! Maximum allowed size is ${sizeLabel}`);
        return;
      }

      // For vibes, only allow videos
      if (selectedType === 'vibe') {
        if (!selectedFile.type.startsWith('video/')) {
          toast.error('Vibes only support videos');
          return;
        }
      } else {
        // For posts and stories, allow both images and videos
        if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
          toast.error('Please select an image or video file');
          return;
        }
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    
    // Determine the field name based on selected type
    const fieldName = selectedType === 'vibe' ? 'video' : 'media';
    formData.append(fieldName, file);
    
    // Add caption
    if (caption) formData.append('caption', caption);
    
    // For posts, add mediaType
    if (selectedType === 'post') {
      const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      formData.append('mediaType', mediaType);
    }

    // Proper way to log FormData contents
    console.log("Selected Type:", selectedType);
    console.log("Field Name:", fieldName);
    console.log("File:", file);
    console.log("Caption:", caption);
    
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }

    try {
      setLoading(true);
      const endpoint = selectedType === 'post' ? '/posts/upload' : 
                       selectedType === 'story' ? '/story/upload' : 
                       '/vibes/upload';
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        formData,
        {
          withCredentials: true,
        }
      );
      
      toast.success(response.data.message || `${selectedType} uploaded successfully!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setFile(null);
    setPreview(null);
    setCaption('');
  };

  return (
    <div className="min-h-screen bg-[--color-bg] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 cursor-pointer text-text-secondary hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="text-xl" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-500 to-pink-500 mb-2">
            Create & Share
          </h1>
          <p className="text-text-secondary">
            {selectedType ? `Upload your ${selectedType}` : 'Choose what you want to share'}
          </p>
        </div>

        {/* Type Selection */}
        {!selectedType ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {uploadTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`${type.bgColor} border-2 ${type.borderColor} rounded-2xl p-6 cursor-pointer 
                             hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-${type.borderColor}/20`}
                >
                  <div className={`w-16 h-16 rounded-full bg-linear-to-r ${type.color} 
                                 flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-white">
                    {type.title}
                  </h3>
                  <p className="text-text-secondary text-center text-sm">
                    {type.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Upload Form */
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
            {/* Back Button */}
            <button
              onClick={resetForm}
              className="mb-6 text-[var(--color-text-secondary)] hover:text-white flex items-center gap-2 transition-colors"
            >
              <MdClose className="text-xl" />
              <span>Change type</span>
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              {!preview ? (
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-12 text-center 
                               hover:border-purple-500 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('fileInput').click()}>
                  <MdPhotoLibrary className="text-6xl text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload {selectedType}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Click to select
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    accept={selectedType === 'vibe' ? 'video/*' : 'image/*,video/*'}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Preview */
                <div className="relative rounded-xl overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img src={preview} alt="Preview" className="w-full max-h-96 object-cover" />
                  ) : (
                    <video src={preview} controls className="w-full max-h-96" />
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 
                             rounded-full transition-colors"
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>
              )}

              {/* Caption Input */}
              
              {(selectedType === 'post'|| selectedType === 'vibe') && <div>
                <label className="block text-sm font-medium mb-2">
                  Caption 
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={`Write a caption for your ${selectedType}...`}
                  rows="4"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3
                           text-white placeholder-[var(--color-text-muted)] focus:outline-none 
                           focus:border-purple-500 transition-colors resize-none"
                />
              </div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 
                         hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white 
                         font-semibold py-3 rounded-xl transition-all duration-300 
                         disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="#ffffff" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  `Share ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPost;
