import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {upload, handleMulterError} from "../middlewares/multer.middleware.js";
import { getAllStory, getStoryByUsername, uploadStory, viewStory } from "../controllers/story.controller.js";

const storyRouter = express.Router();

storyRouter.post("/upload", authMiddleware, upload.single("media"), handleMulterError, uploadStory);
storyRouter.get("/view/:storyId", authMiddleware, viewStory);
storyRouter.get("/getByUsername/:username", authMiddleware, getStoryByUsername);
storyRouter.get("/getAllStories", authMiddleware, getAllStory);
export default storyRouter;