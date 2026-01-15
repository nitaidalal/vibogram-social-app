import express from 'express';
import {
  signin,
  signup,
  signout,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js"; 

const authRouter = express.Router();

authRouter.post("/signup",signup);
authRouter.post("/signin", signin);
authRouter.get("/signout", signout);
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;