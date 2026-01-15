import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../config/Mail.js";

export const signup = async (req,res) => {
    try {
        const {name,username,email,password} = req.body;

        //check email
        const alreadyExistedUserByEmail = await User.findOne({email});
        if(alreadyExistedUserByEmail){
            return res.status(400).json({message:"User already exists with this email"});
        }

        //check username
        const alreadyExistedUserByUsername = await User.findOne({username});
        if(alreadyExistedUserByUsername){
            return res.status(400).json({message:"User already exists with this username"});
        }

        //password length check
        if(password.length<6){
            return  res.status(400).json({message:"Password must be at least 6 characters long"});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            name,
            username,
            email,
            password:hashedPassword
        });

        const token = await generateToken(newUser._id);

        
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:5*365*24*60*60*1000, //5 years
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict"
        })

        res.status(201).json({message:"User created successfully", user:newUser, token});

    } catch (error) {
        res.status(500).json({message:"Signup failed", error:error.message});
    }
}



//sign-in

export const signin = async (req, res) => {
  try {
    const {username, password } = req.body;


    const user = await User.findOne({username});

    if(!user){
        return res.status(400).json({message:"User not found with this username"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid password"});
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 5 * 365 * 24 * 60 * 60 * 1000, //5 years
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res
      .status(201)
      .json({ message: "User signed in successfully", user: user, token });
  } catch (error) {
    res.status(500).json({ message: "Signin failed", error: error.message });
  }
};

//signout functionality
export const signout = (req,res) =>{
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Signout failed", error: error.message });
    }
}


export const sendOtp = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found with this email"});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        console.log(otp);

        const hashedOtp = await bcrypt.hash(otp,10);

        user.resetOtp = hashedOtp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();
        await sendMail(email, otp, user.username);

        res.status(200).json({message:"OTP sent to your email"});
    } catch (error) {
        res.status(500).json({message:"Failed to send OTP", error:error.message});
    }
}

export const verifyOtp = async (req,res) => {
    try {
        const {email, otp} = req.body;
        const user = await User.findOne({email});
        if(!user || !user.resetOtp){
            return res.status(400).json({message:"User not found with this email"});
        }
    
        if(user.otpExpiry < Date.now()){
            return res.status(400).json({message:"OTP has expired"});
        }

        const isOtpValid = await bcrypt.compare(otp, user.resetOtp);

        if(!isOtpValid){
            return res.status(400).json({message:"Invalid OTP"});
        }
        user.isOtpVerified = true;
        user.resetOtp = "";
        user.otpExpiry = null;
        await user.save();
        res.status(200).json({message:"OTP verified successfully"});
    } catch (error) {
        return res.status(500).json({message:"OTP verification failed", error:error.message});
    }
}

export const resetPassword = async (req,res) => {
    try {
        const { email, newPassword } = req.body;
                const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
          return res.status(400).json({ message: "OTP not verified" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();
        return res
          .status(200)
          .json({ message: "Password reset  succcessfully✅" });
    } catch (error) {
        console.log(error); 
        return res.status(500).json({message:"Password reset error"})
    }
}