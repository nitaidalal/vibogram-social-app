import { useState } from "react";
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
  const inputClassName =
    "w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/70";

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg px-4 py-10 md:px-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-gradient opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-gradient opacity-20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden    lg:grid-cols-2">
        <div className="hidden  p-10 text-white lg:flex lg:flex-col lg:justify-center lg:items-center">
          <div className="mb-10">
            <h2 className="mb-3 text-5xl font-bold leading-tight">
              Welcome back.
            </h2>
            <p className="text-sm/6 text-text-secondary">
              Reconnect with your people, your stories, and your daily vibes.
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
              Sign in
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Enter your details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  className={inputClassName}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-secondary transition hover:text-text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl bg-brand-gradient py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <ClipLoader color="#ffffff" size={24} /> : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-right text-sm">
            <p
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer text-text-secondary transition hover:text-primary"
            >
              Forgot Password?
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="cursor-pointer font-semibold text-primary transition hover:opacity-80"
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
