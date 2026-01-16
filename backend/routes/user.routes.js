import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getCurrentUser, suggestedUsers, updateProfile } from '../controllers/user.controller.js';
import { imageUpload } from '../middlewares/multer.middleware.js';
const userRouter = express.Router();

userRouter.get("/current", authMiddleware, getCurrentUser);
userRouter.get("/suggested", authMiddleware, suggestedUsers);
userRouter.put("/update-profile", authMiddleware, imageUpload.single("profileImage"), updateProfile);
export default userRouter;