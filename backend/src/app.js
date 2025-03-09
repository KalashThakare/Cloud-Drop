import express from "express";
import { config } from "dotenv";
import cors from "cors";
import multer from "multer";
import authRoutes from "./routes/authRoutes.js"
import functionRoutes from "./routes/functionRoutes.js"
import connectToDb from "./dataBase/db.js";
import dotenv from "dotenv";

dotenv.config();

connectToDb();

const upload = multer({dest:'uploads/'});
config({path:'./config/.env'});

const app =express();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/auth",authRoutes);
app.use("/func",functionRoutes);


export default app;