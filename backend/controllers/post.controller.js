import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import fs from "fs";

export const uploadPost = async (req, res) => {
    let filePath = null;
    try {
        const userId = req.userId;
        const {caption, mediaType} = req.body;

        // Validate mediaType
        if (!mediaType || !['image', 'video'].includes(mediaType)) {
            return res.status(400).json({
                message: "Invalid mediaType. Must be 'image' or 'video'"
            });
        }

        // Check if file is uploaded
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        // Check if file is on disk or in memory
        let fileUri;
        if (file.path) {
            // File is on disk
            filePath = file.path;
            fileUri = filePath;
        } else {
            // File is in memory (buffer)
            const fileBase64 = file.buffer.toString("base64");
            fileUri = `data:${file.mimetype};base64,${fileBase64}`;
        }

        // Configure upload options based on mediaType
        let uploadOptions = {
            folder: "vibogram/posts",
            resource_type: mediaType,
        };

        // Add specific transformations based on mediaType
        if (mediaType === 'image') {
            uploadOptions.transformation = [
                { width: 1080, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ];
        } else if (mediaType === 'video') {
            uploadOptions.chunk_size = 6000000;
        }

        // Upload to cloudinary
        const uploadResult = await cloudinary.uploader.upload(fileUri, uploadOptions);
        const mediaUrl = uploadResult.secure_url;

        // Delete temporary file if it exists
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            filePath = null;
        }

        const post = await Post.create({
            author: userId,
            caption,
            mediaUrl,
            mediaType
        })

        const user = await User.findById(userId);
        user.posts.push(post._id);
        await user.save();

        // Populate author field
        const userPost = await Post.findById(post._id).populate("author", "-password");
        
        res.status(200).json({
            message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} post uploaded successfully`,
            post: userPost
        });

    } catch (error) {
        // Delete temporary file if upload fails
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.log("Post Upload Error:", error);
        res.status(500).json({
            message: "Post upload failed",
            error: error.message
        });
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate("author", "name username profileImage")
            .populate("comments.author", "name username profileImage")
            .sort({ createdAt: -1 });
        console.log("Fetched Posts:", posts);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }
        await Post.findByIdAndDelete(postId);

        // Remove post reference from user's posts array
        await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Delete Post Error:", error);
        res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found"});    
        }

        const alreadyLiked = post.likes.some(
          (id) => id.toString() === req.userId,
        );
        if(alreadyLiked){
            post.likes.pull(req.userId);
        }else{
            post.likes.push(req.userId);
        }

        await post.save();
        await post.populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);
        return res.status(200).json({message: alreadyLiked ? "Post unliked" : "Post liked", post});
    } catch (error) {
        console.error("Like Post Error:", error);
        return res.status(500).json({message:"Like Post error", error} );
    }
}


export const commentOnPost = async (req,res) => {
    try {
        const {content} = req.body;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found"});    
        }

        const comment = {
            author: req.userId,
            content
        };
        post.comments.push(comment);
        await post.save();
        await post.populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);
        return res.status(200).json({message: "Comment added", post});
    } catch (error) {
        console.error("Comment Post Error:", error);
        return res.status(500).json({message:"Comment Post error", error} );
    }
}

export const savedPost = async (req,res) => {
    try {
        const postId = req.params.postId;
        const user = await User.findById(req.userId);
        const alreadySaved = user.savedPosts.some(
          (id) => id.toString() === postId,
        );

        if(alreadySaved){
            user.savedPosts.pull(postId);
        }else{
            user.savedPosts.push(postId);
        }
        await user.save();
        return res.status(200).json({message: alreadySaved ? "Post unsaved" : "Post saved", savedPosts: user.savedPosts});
    } catch (error) {
        console.error("Save Post Error:", error);
        return res.status(500).json({message:"Save Post error", error} );
    }
}