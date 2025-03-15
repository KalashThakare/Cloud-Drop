import mongoose from "mongoose";

const configModel = new mongoose.Schema({
    bucketName:{
        type:String,
        required:true
    },
    bucketRegion:{
        type:String,
        required:true
    },
    bucketKey:{
        type:String,
        required:true
    },
    bucketSecret:{
        type:String,
        required:true
    }
})

const Bucket = new mongoose.model('config',configModel);

export default Bucket;