import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { uploadImage, uploadVideo } from '../controllers/upload.controller.js';
import { imageUpload,videoUpload } from '../middlewares/multer.middleware.js';

const uploadRouter = express.Router();
uploadRouter.post("/image", authMiddleware, imageUpload.single("file"), uploadImage);
uploadRouter.post("/video", authMiddleware, videoUpload.single("file"), uploadVideo);
export default uploadRouter;