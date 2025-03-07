import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

const User = new mongoose.model("User",UserModel);

export default User;