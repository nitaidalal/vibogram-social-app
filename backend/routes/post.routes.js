import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { commentOnPost, getAllPosts, likePost, savedPost, uploadPost } from '../controllers/post.controller.js';
import { upload, handleMulterError } from '../middlewares/multer.middleware.js';

const postRouter = express.Router();

// Single unified endpoint for uploading posts (image or video based on mediaType)
postRouter.post("/upload", authMiddleware, upload.single("media"), handleMulterError, uploadPost);
postRouter.get("/getAllPosts", authMiddleware, getAllPosts);
postRouter.post("/like/:postId", authMiddleware, likePost);
postRouter.post("/comment/:postId", authMiddleware, commentOnPost);
postRouter.get("/saved/:postId", authMiddleware, savedPost);

export default postRouter;
