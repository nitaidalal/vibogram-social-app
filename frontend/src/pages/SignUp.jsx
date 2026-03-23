import { useState } from 'react'
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
  const inputClassName =
    "w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/70";


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

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-bg px-4 py-10 md:px-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-gradient opacity-20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden    lg:grid-cols-2">
        <div className="hidden  p-10 text-white lg:flex lg:flex-col lg:justify-center lg:items-center">
          <div className="mb-10">
            <h2 className="mb-3 text-5xl font-bold leading-tight">
              Join the vibe.
            </h2>
            <p className="text-sm/6 text-text-secondary">
              Build your profile, connect with friends, and share your moments.
            </p>
          </div>
          <img
            src="/banner.png"
            alt="Social feed preview"
            className="w-full rounded-2xl border border-white/30"
          />
        </div>

        <div className="p-6 sm:p-10 lg:p-12  border border-border bg-surface rounded-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">
              Create account
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Start your journey in a few seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Username <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={inputClassName}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-secondary transition hover:text-text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">
                      Strength: {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={`${passwordStrength.color} h-full transition-all duration-300 ease-in-out`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl bg-brand-gradient py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <ClipLoader color="#ffffff" size={24} /> : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="cursor-pointer font-semibold text-primary transition hover:opacity-80"
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
