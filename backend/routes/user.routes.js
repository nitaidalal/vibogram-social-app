import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getCurrentUser, suggestedUsers } from '../controllers/user.controller.js';
const userRouter = express.Router();

userRouter.get("/current", authMiddleware, getCurrentUser);
userRouter.get("/suggested", authMiddleware, suggestedUsers);
export default userRouter;