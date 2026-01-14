import React, { useState } from 'react'

const ForgotPassword = () => {
    const [step,setStep] = useState(1);
    const [email,setEmail] = useState("");
    const [otp,setOtp] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
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
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold cursor-pointer py-3 rounded-lg transition duration-200"
            >
              Send OTP
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
              onClick={() => setStep(3)}
              className="w-full mt-6 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold cursor-pointer py-3 rounded-lg transition duration-200"
            >
              Verify OTP
            </button>
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
            <button className="w-full mt-6 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold cursor-pointer py-3 rounded-lg transition duration-200">
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword
