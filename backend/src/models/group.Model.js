import mongoose from "mongoose";

const groupModel = new mongoose.Schema({
    groupName:{
        required:true,
        type:String
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

const group = new mongoose.model("Group",groupModel);

export default group;