import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const uploadPost = async (req, res) => {
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

        // Convert file to base64
        const fileBase64 = file.buffer.toString("base64");
        const fileUri = `data:${file.mimetype};base64,${fileBase64}`;

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
            uploadOptions.transformation = [
                { quality: "auto" },
            ];
        }

        // Upload to cloudinary
        const uploadResult = await cloudinary.uploader.upload(fileUri, uploadOptions);
        const mediaUrl = uploadResult.secure_url;

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
        console.log("Post Upload Error:", error);
        res.status(500).json({
            message: "Post upload failed",
            error: error.message
        });
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({author: req.userId})
            .populate("author", "-password")
            .sort({ createdAt: -1 });
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


