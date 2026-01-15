import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getCurrentUser } from '../controllers/user.controller.js';
const userRouter = express.Router();

userRouter.get("/current", authMiddleware, getCurrentUser);

export default userRouter;