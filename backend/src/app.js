import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import userBucketawsRoutes from "./routes/userBucket/userBucket.awsRoutes.js"
import platformBucketawsRoutes from "./routes/platformBucket/platformBucket.awsRoutes.js"
import connectToDb from "./dataBase/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import messageRoute from "./routes/Chat/message.Route.js";
import groupRoute from "./routes/Chat/group.Route.js";
import {app} from "../src/lib/socket.js";
import subscriptionRoutes from "../src/routes/subscriptionRoutes.js";
import fileManagementRoutes from "../src/routes/fileManagement/fileManagementRoutes.js";
import OTPverificationRoutes from "../src/routes/mailVerification/otp.Routes.js";

dotenv.config();

connectToDb();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/use-platform-bucket",platformBucketawsRoutes);
app.use("/api/start-user-bucket-session",userBucketawsRoutes);
app.use("/api/messages",messageRoute);
app.use("/api/group",groupRoute);
app.use("/api/subscription",subscriptionRoutes);
app.use("/api/files",fileManagementRoutes);
app.use("/api",OTPverificationRoutes);

export default app;