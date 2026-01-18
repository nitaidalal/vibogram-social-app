import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("posts").select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({user});
    } catch (error) {
        return res.status(500).json({message:"Server error"});
    }
}


export const suggestedUsers = async (req,res)=>{
    try {
        const users = await User.find({
            _id: { $ne: req.userId } // Exclude the current user
        }).select("-password");
        return res.status(200).json({users});
    } catch (error) {
        return res.status(500).json({message:"suggested users error", error} );
    }
}


export const updateProfile = async (req,res) => {
    try {
        const userId = req.userId;
        const {name,username, bio,gender} = req.body;

        //check if username is taken by other user
        const existingUser = await User.findOne({username});
        if(existingUser && existingUser._id.toString() !== userId){
            return res.status(400).json({success:false, message:"Username is already taken"});
        }

        let profileImageUrl;
        if(req.file){
            const fileBase64 = req.file.buffer.toString("base64");
            const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
            const uploadResult = await cloudinary.uploader.upload(fileUri, {
              folder: "vibogram/profiles",
              resource_type: "image",
              transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
                { quality: "auto" },
                { fetch_format: "auto" },
              ],
            });
            profileImageUrl = uploadResult.secure_url;
        }

        const updatedData = {
            ...(name && {name}),
            ...(username && {username}),
            ...(bio && {bio}),
            ...(gender && {gender}),
            ...(profileImageUrl && {profileImage:profileImageUrl})
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");
        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({updatedUser});
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({message:"Update profile error", error});
    }
}

export const getProfile = async(req,res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({ username }).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message:"Get profile error", error});
    }
}