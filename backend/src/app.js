import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import functionRoutes from "./routes/functionRoutes.js"
import connectToDb from "./dataBase/db.js";
import dotenv from "dotenv";

dotenv.config();

connectToDb();

const app =express();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth",authRoutes);
app.use("/api/func",functionRoutes);


export default app;