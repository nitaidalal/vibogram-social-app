import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { uploadPost } from '../controllers/post.controller.js';
import { postUpload } from '../middlewares/multer.middleware.js';

const postRouter = express.Router();

// Single unified endpoint for uploading posts (image or video based on mediaType)
postRouter.post("/upload", authMiddleware, postUpload.single("file"), uploadPost);

export default postRouter;
