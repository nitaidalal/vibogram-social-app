import express from 'express';
import { signin,signup,signout } from '../controllers/auth.controller.js';
const authRouter = express.Router();

authRouter.post("/signup",signup);
authRouter.post("/signin", signin);
authRouter.get("/signout", signout);
export default authRouter;