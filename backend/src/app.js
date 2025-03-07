import express from "express";
import { config } from "dotenv";
import cors from "cors";
import multer from "multer";

const upload = multer({dest:'uploads/'});
config({path:'./config/.env'});

const app =express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/auth",authRoutes);
app.use("/func",functionRoutes);


export default app;