import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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