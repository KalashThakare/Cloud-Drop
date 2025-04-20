import mongoose from "mongoose";

const groupMemberModel = new mongoose.Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
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

const GroupMembers = new mongoose.model("GroupMembers",groupMemberModel);

export default GroupMembers;