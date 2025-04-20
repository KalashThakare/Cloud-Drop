import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import userBucketawsRoutes from "./routes/userBucket/userBucket.awsRoutes.js"
import platformBucketawsRoutes from "./routes/platformBucket/platformBucket.awsRoutes.js"
import connectToDb from "./dataBase/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import messageRoute from "./routes/Chat/message.Route.js";

dotenv.config();

connectToDb();

const app =express();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/use-platform-bucket",platformBucketawsRoutes);
app.use("/api/start-user-bucket-session",userBucketawsRoutes);
app.use("/api/messages",messageRoute)

export default app;