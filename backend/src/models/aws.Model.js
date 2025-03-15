import mongoose from "mongoose";

const configModel = new mongoose.Schema({
    bucket_name:{
        type:String,
        required:true
    },
    bucket_region:{
        type:String,
        required:true
    },
    bucket_key:{
        type:String,
        required:true
    },
    bucket_secret:{
        type:String,
        required:true
    }
})

const config = new mongoose.model('config',configModel);

export default config;