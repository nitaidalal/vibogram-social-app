import  { useState } from 'react'
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import axios from 'axios';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';


const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordStrength = (password) => {
    if (!password) {
      return { level: 0, text: "", color: "bg-gray-300", width: "0%" };
    }

    if (password.length < 6) {
      return { level: 1, text: "Too Short", color: "bg-red-500", width: "20%" };
    }

    let score = 0;

    if (password.length >= 10) score++;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;


    if (score <= 1) {
      return { level: 1, text: "Weak", color: "bg-red-500", width: "25%" };
    }

    if (score === 2) {
      return { level: 2, text: "Good", color: "bg-yellow-500", width: "50%" };
    }

    if (score === 3) {
      return { level: 3, text: "Strong", color: "bg-green-500", width: "75%" };
    }


    return {
      
      level: 4,
      text: "Very Strong",
      color: "bg-green-600",
      width: "100%",
    };
  };
  

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if(formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if(formData.username.length < 3) {
      toast.error('Username must be at least 3 characters long.');
      return;
    }
    try {
      setLoading(true);
      let response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, formData,{
        withCredentials: true
      });
      // Store only user data, NOT token (token is in httpOnly cookie)
      dispatch(setUserData(response.data.user));
      toast.success(response.data.message || 'Signup successful!');
      navigate("/");
      console.log('Form submitted:', formData);
    } catch (error) {
      toast.error(error.response.data.message || 'Signup failed. Please try again.');
      console.error('Signup error:', error);
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-8">
      <div className="w-[80%] max-w-md rounded-2xl p-8 lg:p-12 bg-linear-to-r from-slate-900 to-gray-900 shadow-2xl">
        {/* Signup Form */}
        <div>
          <div className=" mb-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <h1 className="text-4xl font-bold text-white ">Join</h1>
              <div className="flex items-center">
                <img src="/logo.png" alt="" className="h-10 w-10 ml-2 pt-1" />
                <span className="text-primary text-4xl font-bold ">
                  ibogram
                </span>
              </div>
            </div>
            <p className="text-gray-200">
              Create your account and start sharing vibes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-2"
              >
                Name <span className=" text-red-500 ">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-2"
              >
                Username <span className=" text-red-500 ">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email Address <span className=" text-red-500 ">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password <span className=" text-red-500 ">*</span>
              </label>
              <div className="relative ">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className=" w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  required
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </span>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${
                        getPasswordStrength(formData.password).level === 1
                          ? "text-red-500"
                          : getPasswordStrength(formData.password).level === 2
                          ? "text-yellow-500"
                          : getPasswordStrength(formData.password).level === 3
                          ? "text-green-500"
                          : "text-green-600"
                      }`}
                    >
                      {getPasswordStrength(formData.password).text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        getPasswordStrength(formData.password).color
                      } transition-all duration-300 ease-in-out`}
                      style={{
                        width: getPasswordStrength(formData.password).width,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading?(
                <ClipLoader color="#ffffff" size={30} />
              ):(
                "Sign Up"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-200 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-purple-400 font-semibold hover:text-purple-300 transition duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp
