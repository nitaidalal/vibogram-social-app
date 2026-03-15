import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { commentOnPost, deletePost, getAllPosts, getPostById, likePost, reportPost, savedPost, uploadPost } from '../controllers/post.controller.js';
import { upload, handleMulterError } from '../middlewares/multer.middleware.js';

const postRouter = express.Router();

// Single unified endpoint for uploading posts (image or video based on mediaType)
postRouter.post("/upload", authMiddleware, upload.single("media"), handleMulterError, uploadPost);
postRouter.get("/getAllPosts", authMiddleware, getAllPosts);
postRouter.get("/:postId", authMiddleware, getPostById);
postRouter.post("/like/:postId", authMiddleware, likePost);
postRouter.post("/comment/:postId", authMiddleware, commentOnPost);
postRouter.get("/saved/:postId", authMiddleware, savedPost);
postRouter.delete("/delete/:postId", authMiddleware, deletePost);
postRouter.post("/report/:postId", authMiddleware, reportPost);

export default postRouter;
