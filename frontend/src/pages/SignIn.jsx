import  { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      let response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`, formData,{
        withCredentials: true
      });
      // Store only user data, NOT token (token is in httpOnly cookie)
      dispatch(setUserData(response.data.user));
      toast.success(response.data.message || "Signin successful!");
      navigate("/");
      console.log("Form submitted:", formData);
    } catch (error) {
      toast.error(error.response.data.message || "Signin failed. Please try again.");
      console.error("Signin error:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-8">
      <div className="w-[80%] max-w-md rounded-2xl p-8 lg:p-12 bg-linear-to-r from-slate-900 to-gray-900 shadow-2xl">
        {/* Signup Form */}
        <div>
          <div className=" mb-8 text-center">
            <div className="flex flex-col sm:flex-row items-center gap-2 justify-center mb-4">
              <h1 className="text-3xl font-bold text-white ">Sign In To</h1>
              <div className="flex items-center">
                <img src="/logo.png" alt="" className="h-10 w-10 ml-2 pt-1" />
                <span className="text-primary text-4xl font-bold ">
                  ibogram
                </span>
              </div>
            </div>
          
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            

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
                placeholder="Enter yourusername"
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
                  placeholder="Enter your password"
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
            </div>

              
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r cursor-pointer from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <ClipLoader color="#ffffff" size={30} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="mt-4 text-right text-sm text-gray-300 hover:underline cursor-pointer">
            <p onClick={() => navigate("/forgot-password")}>Forgot Password?</p>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-200 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-purple-400 font-semibold hover:text-purple-300 transition duration-200 cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
