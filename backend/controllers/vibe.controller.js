import User from "../models/user.model.js";
import Vibe from "../models/vibe.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadVibe = async (req, res) => {
  let filePath = null;
  try {
    const userId = req.userId;
    const { caption } = req.body;

    const file = req.file;
    console.log("File mimetype:", req.file.mimetype);
    console.log("File path:", req.file.path);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!file.mimetype.startsWith("video/")) {
      // Delete file if validation fails
      if (file.path) fs.unlinkSync(file.path);
      return res.status(400).json({
        message: "Only video files are allowed for vibes",
      });
    }

    filePath = file.path;

    // Upload to Cloudinary from disk
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "vibogram/vibes",
      resource_type: "video",
    });

    // Delete the temporary file after successful upload
    fs.unlinkSync(filePath);
    filePath = null;

    const vibe = await Vibe.create({
      author: userId,
      caption,
      mediaUrl: uploadResult.secure_url,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { vibes: vibe._id },
    });

    const userVibe = await Vibe.findById(vibe._id).populate(
      "author",
      "name username profileImage",
    );

    return res.status(200).json({
      message: "Vibe uploaded successfully",
      vibe: userVibe,
    });
  } catch (error) {
    // Delete file if upload fails
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Vibe Upload Error:", error);
    return res.status(500).json({
      message: "Vibe upload failed",
      error: error.message,
    });
  }
};


export const likeVibe = async (req, res) => {
    try {
        const userId = req.userId;
        const {vibeId} = req.params;

        const vibe = await Vibe.findById(vibeId);
        if(!vibe){
            return res.status(404).json({message:"Vibe not found"});
        }
        // Check if user already liked the vibe
        const alreadyLiked = vibe.likes.some(like => like.toString() === userId);
        if(alreadyLiked){
            vibe.likes.pull(userId);
        }else{
            vibe.likes.push(userId);
        }

        await vibe.save();
        await vibe.populate("author", "name username profileImage");
        return res.status(200).json({message:"Vibe liked successfully", vibe});
        
    } catch (error) {
        console.error("Like Vibe Error:", error);
        return res.status(500).json({message:"Like vibe error", error});
    }
}


export const commentOnVibe = async (req,res) => {
    try {
       const userId = req.userId;
         const {vibeId} = req.params;
        const {content} = req.body;

        const vibe = await Vibe.findById(vibeId);
        if(!vibe){
            return res.status(404).json({message:"Vibe not found"});
        }
        const comment = {
            author: userId,
            content,
        };
        vibe.comments.push(comment);
        await vibe.save();
        await vibe.populate("author", "name username profileImage");
        return res.status(200).json({message:"Comment added successfully", vibe});
    } catch (error) {
        console.error("Comment Vibe Error:", error);
        return res.status(500).json({message:"Comment vibe error", error});
    }
}


export const getAllVibes = async (req,res) => {
    try {
        const vibes = await Vibe.find({}).populate("author", "name username profileImage").sort({createdAt:-1}).populate("comments.author", "name username profileImage");
        return res.status(200).json({vibes});
    } catch (error) {
        console.error("Get All Vibes Error:", error);   
        return res.status(500).json({message:"Get all vibes error", error});
    }
}