import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import vibeRouter from './routes/vibe.routes.js';
import storyRouter from './routes/story.routes.js';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

//built-in middlewares
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
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


app.get("/",(req,res) => {
    res.send("hello");
}) 

app.listen(port,()=> {
    connectDb();
    console.log(`server started on port ${port}`);
})