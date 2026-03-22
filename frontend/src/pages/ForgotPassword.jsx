import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const inputClassName =
    "w-full rounded-xl border border-gray-600 bg-slate-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500";

  // 🔹 SEND OTP
  const handleSendOtp = async () => {
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`,
        { email },
      );
      toast.success(res.data.message);
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 RESEND OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      setResendLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`,
        { email },
      );
      toast.success(res.data.message || "OTP resent");
      setResendTimer(30);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify-otp`,
        { email, otp },
      );
      toast.success(res.data.message);
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
  };

  // 🔹 RESET PASSWORD
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("All fields required");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,
        { email, newPassword },
      );
      toast.success(res.data.message);

      // redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 TIMER
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-8 bg-black">
      <div className="w-[90%] max-w-md rounded-2xl p-8 bg-slate-800 shadow-2xl">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
            <p className="text-gray-400 mt-2">
              Enter your email to receive OTP
            </p>

            <input
              type="email"
              placeholder="Enter email"
              className={`${inputClassName} mt-6`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg text-white font-semibold"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-bold text-white">Verify OTP</h1>
            <p className="text-gray-400 mt-2">
              Enter the OTP sent to your email
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className={`${inputClassName} mt-6`}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg text-white font-semibold"
            >
              Verify OTP
            </button>

            <div className="mt-4 text-center text-sm text-gray-400">
              Didn’t receive OTP?{" "}
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || resendLoading}
                className="text-purple-400"
              >
                {resendLoading
                  ? "Sending..."
                  : resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>

            <input
              type="password"
              placeholder="New Password"
              className={`${inputClassName} mt-6`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className={`${inputClassName} mt-4`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg text-white font-semibold"
            >
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
