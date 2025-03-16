import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import functionRoutes from "./routes/functionRoutes.js"
import awsRoutes from "./routes/awsRoutes.js"
import connectToDb from "./dataBase/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

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
app.use("/api/func",functionRoutes);
app.use("/api/aws",awsRoutes);


export default app;