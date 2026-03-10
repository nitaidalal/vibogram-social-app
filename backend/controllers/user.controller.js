import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import Notification from "../models/notification.model.js";
import {io, getReceiverSocketId } from "../config/socket.js";

export const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId)
            .populate("posts")
            .populate("story")
            .select("-password");
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
        const user = await User.findOne({ username })
            .select("-password")
            .populate({
                path: "posts",
                populate: [
                    { path: "author", select: "name username profileImage" },
                    { path: "comments.author", select: "name username profileImage" }
                ]
            })
            .populate({
                path: "savedPosts",
                populate: [
                    { path: "author", select: "name username profileImage" },
                    { path: "comments.author", select: "name username profileImage" }
                ]
            })
            .populate({
                path:"vibes",
                populate:[
                    {path:"author",select:"name username profileImage"},
                    {path:"comments.author",select:"name username profileImage" }
                ]
            });
        
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message:"Get profile error", error});
    }
}

export const followUser = async (req, res) => {
    try {
        const userIdToFollow = req.params.userId;
        const currentUserId = req.userId;

        // Can't follow yourself
        if (userIdToFollow === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const currentUser = await User.findById(currentUserId);
        const userToFollow = await User.findById(userIdToFollow);

        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAlreadyFollowing = currentUser.following.includes(userIdToFollow);

        if (isAlreadyFollowing) {
          // Unfollow
          currentUser.following.pull(userIdToFollow);
          userToFollow.followers.pull(currentUserId);
          await currentUser.save();
          await userToFollow.save();
          return res.status(200).json({
            message: "Unfollowed successfully",
            isFollowing: false,
          });
        } else {
          // Follow
          currentUser.following.push(userIdToFollow);
          userToFollow.followers.push(currentUserId);
          await currentUser.save();
          await userToFollow.save();


          // Create a notification for the followed user
          
            const notification = await Notification.create({
              recipient: userIdToFollow,
              sender: currentUserId,
              type: "follow",
              message: `started following you!`,
            });
            await notification.populate("sender recipient", "name username profileImage");
            const receiverSocketId = getReceiverSocketId(userIdToFollow);
            if (receiverSocketId) {
              io.to(receiverSocketId).emit("newNotification", notification);
            }
          
          return res.status(200).json({
            message: "Followed successfully",
            isFollowing: true,
          });
        }


        
    } catch (error) {
        console.error("Follow User Error:", error);
        return res.status(500).json({ message: "Follow user error", error });
    }
}

export const changePassword = async(req,res)=>{
    try {
        const {currentPassword, newPassword} = req.body;
        const currentUserId = req.userId;

        //find user 
        const user = await User.findById(currentUserId);
        if(!user){
            return res.status(404).json({message:"You are unauthticated"});
        }

        //check currentPassword
        const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);
        console.log(isValidCurrentPassword)

        if(!isValidCurrentPassword){
            return res.status(400).json({message:"You entered wrong current password"});
        }

        const newHashedPassword = await bcrypt.hash(newPassword,10);
        user.password = newHashedPassword;
        await user.save();
        res.status(200).json({message:"Password changed successfully"});
    } catch (error) {
        console.log("change password error",error.message);
        res.status(500).json({message:"Error in changing password"})
    }
}


export const searchUsers = async(req,res) => {
    try {
        const {query} = req.params;
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, //regex for case-insensitive search in name , options i for case-insensitive
                { username: { $regex: query, $options: "i" } }
            ]
        }).select("name username profileImage");
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message:"Error in searching users", error});
    }
}
