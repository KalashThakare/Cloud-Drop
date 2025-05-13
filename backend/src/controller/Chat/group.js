import Group from "../../models/group.Model.js";
import User from "../../models/user.Model.js";

export const createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        const userId = req.user._id;

        if (!groupName) {
            return res.status(400).json({ message: "groupName is required" });
        }

        const newGroup = new Group({
            groupName,
            createdBy: userId,
            members: [{
                email: req.user.email,
                userId,
                joinedAt: new Date()
            }]
        });

        const savedGroup = await newGroup.save();

        res.status(200).json({
            message: "Group created successfully",
            group: savedGroup
        });
    } catch (error) {
        console.error("Error creating group", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addMembersByEmail = async (req, res) => {
    try {
        const  {groupId}  = req.body;
        let  {emails } = req.body;

        if (typeof emails === "string") {
            emails = [emails];
        }

        if (!Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ message: "emails must be a non-empty array" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const addedMembers = [];
        const skipped = [];

        for (const email of emails) {
            const user = await User.findOne({ email });

            if (!user) {
                skipped.push({ email, reason: "User not found" });
                continue;
            }

            const alreadyExists = group.members.some(
                member => member.userId.toString() === user._id.toString()
            );

            if (alreadyExists) {
                skipped.push({ email, reason: "Already a member" });
                continue;
            }

            group.members.push({
                email,
                userId: user._id,
                joinedAt: new Date()
            });

            addedMembers.push({ email, userId: user._id });
        }

        await group.save();

        res.status(200).json({
            message: "Member addition completed",
            addedCount: addedMembers.length,
            skipped,
            addedMembers
        });
    } catch (error) {
        console.error("Error adding members by email:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { email } = req.body;
        const { groupId } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Please provide email of the member to remove" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const originalCount = group.members.length;

        group.members = group.members.filter(member => member.email !== email);

        if (group.members.length === originalCount) {
            return res.status(404).json({ message: "Member not found in group" });
        }

        await group.save();

        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        console.error("Error removing member:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const exitGroup = async(req,res) =>{
    try {
        
        const userId = req.user._id;
        const {groupId} = req.params;

        if(!userId){
            return res.status(404).json({message:"Unauthorised"});
        }

        const group = await Group.findById(groupId);

        if(!group){
            return res.status(404).json({message:"Group not found"});
        }

        const originalCount = group.members.length;

        group.members = group.members.filter(member=>member.userId.toString() !== userId.toString());

        if(group.members.length === originalCount){
            return res.status(404).json({message:"Member not found in group"});
        }

        await group.save();

        res.status(200).json({message:"Exit successfull"})


    } catch (error) {

        console.error("error in exit group controoler:",error);
        res.status(500).json({message:"Internal server error"});
        
    }
};

export const terminateGroup = async(req,res) =>{
    try {

        const userId = req.user._id;
        const {groupId} = req.body;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
          }

        if(userId.toString() === group.createdBy.toString()){
            
            await Group.findByIdAndDelete(groupId);
            return res.status(200).json({message:"Project terminated successfully"});

        }else{
            return res.status(404).json({message:"Only group admin can terminate the group"});
        }
        

    } catch (error) {

        console.error("Error in terminateGroup:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


