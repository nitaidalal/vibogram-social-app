import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import {io, getReceiverSocketId} from "../config/socket.js";
import Notification from "../models/notification.model.js";

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
        const limit = parseInt(req.query.limit) || 10;
        const { cursor } = req.query;
        
        const query = {}; // Fetch all posts, pagination will be handled by cursor and limit

        if (cursor) {
            const cursorPost = await Post.findById(cursor).select("_id createdAt");
            if (!cursorPost) {
                return res.status(400).json({ message: "Invalid cursor" });
            }

            query.$or = [ 
                { createdAt: { $lt: cursorPost.createdAt } },
                { createdAt: cursorPost.createdAt, _id: { $lt: cursorPost._id } }
            ];
        }

        const posts = await Post.find(query)
            .populate("author", "name username profileImage")
            .populate("comments.author", "name username profileImage")
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1);

        const hasMore = posts.length > limit;
        const paginatedPosts = hasMore ? posts.slice(0, limit) : posts;
        const nextCursor = hasMore
            ? paginatedPosts[paginatedPosts.length - 1]?._id?.toString()
            : null;

        res.status(200).json({
            posts: paginatedPosts,
            nextCursor,
            hasMore,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
}

export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate("author", "name username profileImage")
            .populate("comments.author", "name username profileImage");
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch post", error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        console.log("Delete Post Request for ID:", postId);
        const userId = req.userId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        console.log("Post found:", post);
        
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        // Extract public_id from Cloudinary URL to delete the media
        if (post.mediaUrl) {
            try {
                const urlParts = post.mediaUrl.split('/');
                const publicIdWithExtension = urlParts.slice(-2).join('/'); // Gets "vibogram/posts/filename.ext"
                const publicId = publicIdWithExtension.split('.')[0]; // Remove extension
                
                // Delete from Cloudinary based on media type
                await cloudinary.uploader.destroy(publicId, {
                    resource_type: post.mediaType === 'video' ? 'video' : 'image'
                });
                console.log("Media deleted from Cloudinary:", publicId);
            } catch (cloudinaryError) {
                console.log("Cloudinary deletion warning:", cloudinaryError.message);
                // Continue with post deletion even if Cloudinary deletion fails
            }
        }

        // Delete post from database
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

        //real time like update using socket.io
        io.emit("postLiked", {postId, likes: post.likes});

        //create notification for post like
        if(!alreadyLiked && post.author._id.toString() !== req.userId){
            const notification = await Notification.create({
                recipient:post.author,
                sender:req.userId,
                type:"like",
                post:post._id,
                message: `liked your post`
            })
            await notification.populate([
                { path: "sender", select: "name username profileImage" },
                { path: "recipient", select: "name username profileImage" },
                { path: "post", select: "mediaUrl caption mediaType" }
            ]);
            // Emit real-time notification to the recipient
            const receiverSocketId = getReceiverSocketId(post.author._id.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }
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

        const user = await User.findById(req.userId);

        //real time comment update using socket.io
        io.emit("postCommented", {postId, comments: post.comments});

        //create notification for post comment
        if(post.author._id.toString() !== req.userId){
            const notification = await Notification.create({
                recipient:post.author,
                sender:req.userId,
                type:"comment",
                post:post._id,
                message: `commented on your post`
            })

            await notification.populate([
                { path: "sender", select: "name username profileImage" },
                { path: "recipient", select: "name username profileImage" },
                { path: "post", select: "mediaUrl caption mediaType" }
            ]);

            // Emit real-time notification to the recipient
            const receiverSocketId = getReceiverSocketId(post.author._id.toString());

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }

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

export const reportPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const { reason, description } = req.body;

        if (!reason) {
            return res.status(400).json({ message: "Report reason is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Prevent reporting own post
        if (post.author.toString() === userId) {
            return res.status(403).json({ message: "You cannot report your own post" });
        }

        // Prevent duplicate reports from the same user
        const alreadyReported = post.reports.some(
            (r) => r.reportedBy.toString() === userId
        );
        if (alreadyReported) {
            return res.status(409).json({ message: "You have already reported this post" });
        }

        post.reports.push({ reportedBy: userId, reason, description: description || "" });
        await post.save();

        return res.status(200).json({ message: "Post reported successfully" });
    } catch (error) {
        console.error("Report Post Error:", error);
        return res.status(500).json({ message: "Failed to report post", error: error.message });
    }
}