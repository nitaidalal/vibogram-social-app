import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {videoUpload, handleMulterError} from "../middlewares/multer.middleware.js";
import { commentOnVibe, getAllVibes, likeVibe, uploadVibe } from "../controllers/vibe.controller.js";


const vibeRouter = express.Router();

vibeRouter.post("/upload", authMiddleware, videoUpload.single("video"), handleMulterError, uploadVibe);
vibeRouter.get("/getAllVibes", authMiddleware, getAllVibes);
vibeRouter.post("/like/:vibeId", authMiddleware, likeVibe);
vibeRouter.post("/comment/:vibeId", authMiddleware, commentOnVibe);

export default vibeRouter;