import React, { useState, useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import {ClipLoader} from "react-spinners";

const ForgotPassword = () => {
    const [step,setStep] = useState(1);
    const [email,setEmail] = useState("");
    const [otp,setOtp] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);


    const handleSendOtp = async() => {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`, { email });
        toast.success(response.data.message);
        setStep(2);
        setResendTimer(30);
        
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to send Otp");
      }finally{
        setLoading(false);
      }
    }

    const handleResendOtp = async() => {
      if(resendTimer > 0) return;
      try {
        setResendLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`, { email });
        toast.success(response.data.message || 'OTP resent successfully');
        setResendTimer(30);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to resend OTP");
      } finally {
        setResendLoading(false);
      }
    }

    const handleVerifyOtp = async () => {
      try {
        const response =  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-otp`, {
          email,
          otp,
        });
        
        toast.success(response.data.message);

        setStep(3);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Otp verificition error");
      }
    }

    const handleResetPassword = async () => {
      try {
       
        if(newPassword !== confirmPassword){
          return toast.error("Passwords do not match");
        }
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,{email, newPassword});
        toast.success( response.data.message);

        
      } catch (error) {
        toast.error(error?.response?.data?.message || "Otp verificition error");
      }finally{
        setLoading(false);
      }
    }

    useEffect(() => {
      let interval;
      if(resendTimer > 0) {
        interval = setInterval(() => {
          setResendTimer(prev => prev - 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [resendTimer]);
    

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-8">
      <div className="w-[80%] max-w-md rounded-2xl p-8 lg:p-12 bg-slate-800 shadow-2xl">
        {/* Step 1: Enter Email */}
        {step == 1 && (
          <div>
            <h1 className="text-3xl font-bold text-white text-center mb-6">
              Forgot Password
            </h1>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Registered Email <span className=" text-red-500 ">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold cursor-pointer py-3 rounded-lg transition duration-200"
            >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: Confirmation Message */}
        {step == 2 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">OTP Sent ✅</h1>
            <p className="text-white mb-4">
              An OTP has been sent to your registered email address.
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-3 w-full  border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter your OTP"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full mt-6 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold cursor-pointer py-3 rounded-lg transition duration-200"
            >
              Verify OTP
            </button>

            {/* Resend OTP */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-300">Didn't receive the OTP?</span>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || resendLoading}
                className={`font-medium transition-colors ${
                  resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                {resendLoading ? (
                  <ClipLoader size={14} color="#c084fc" />
                ) : resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New password  */}
        {step == 3 && (
          <div>
            <h1 className="text-3xl font-bold text-white text-center mb-10">
              Reset Password
            </h1>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-3 w-full mb-4 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Enter new password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 w-full border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="Confirm new password"
            />
            <button
            onClick={handleResetPassword}
             className="w-full mt-6 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold cursor-pointer py-3 rounded-lg transition duration-200">
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword
