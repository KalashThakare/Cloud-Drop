import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const ConfigSchema = new mongoose.Schema({
    bucketName: {
        type: String,
        required: true
    },
    bucketRegion: {
        type: String,
        required: true
    },
    bucketKey: {
        type: String,
        required: true
    },
    bucketSecret: {
        type: String,
        required: true
    },
    secret:{
        type:String,
        required:true
    }
});

const UserModel = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:[4,'password must be atleast 4 characters long']
    },
    buckets:[ConfigSchema]
});

UserModel.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"24h"});
    return token;
}

const User = new mongoose.model("User",UserModel);

export default User;