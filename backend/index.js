import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import vibeRouter from './routes/vibe.routes.js';
import storyRouter from './routes/story.routes.js';
import messageRouter from './routes/message.routes.js';
import notificationRouter from './routes/notification.routes.js';
import { app, server } from './config/socket.js';

dotenv.config();

const port = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "https://vibely-social-media-app.vercel.app",
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
    : []),
].map((origin) => origin.replace(/\/$/, ""));

//built-in middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "50mb",
  }),
);
app.use(cookieParser());

//routes
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/posts",postRouter); 
app.use("/api/vibes",vibeRouter);
app.use("/api/story",storyRouter);
app.use("/api/messages",messageRouter);
app.use("/api/notifications",notificationRouter);


app.get("/",(req,res) => {
    res.send("hello");
}) 

server.listen(port,()=> {
    connectDb();
    console.log(`server started on port ${port}`);
})