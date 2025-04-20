import mongoose from "mongoose";

const groupMemberModel = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    joinedAt:{
        type:Date,
        default:Date.now()
    }
});

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
    },
    members:[groupMemberModel]
})

const group = new mongoose.model("Group",groupModel);

export default group;