import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected✅")
    } catch (error) {
        console.log("MongoDB connection failed❌", error);
    }
}

export default connectDb;