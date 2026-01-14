import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

dotenv.config();


const port = process.env.PORT || 3000;

const app = express();

//built-in middlewares
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());

//routes
app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);


app.get("/",(req,res) => {
    res.send("hello");
}) 

app.listen(port,()=> {
    connectDb();
    console.log(`server started on port ${port}`);
})