import GroupMembers from "../../models/group-member.Model.js";
import group from "../../models/group.Model.js";
import User from "../../models/user.Model.js"

export const createGroup = async (req, res) => {
    try {

        const {groupName} = req.body;
        const userId = req.user._id;

        console.log(req.user._id);

        if (!groupName) {
            return res.status(404).json({ message: "groupName is undefined" });
        }

        if (!userId) {
            return res.status(404).json({ message: "cannot find user" });
        }

        const newGroup = new group({
            groupName,
            createdBy:userId
        });

        await newGroup.save();

        res.status(200).json({message:"Group created successfully",group:newGroup});


    } catch (error) {
        console.error("Error creating group",err);
        res.status(500).json({message:"Internal server error"});
    }
}

export const addMembersByEmail = async (req, res) => {
    try {

        const { groupId } = req.params;
        const { emails } = req.body;

        if (!emails || !Array.isArray(emails)) {
            return res.status(400).json({ message: "emails must be an array" });
        }

        const group = await group.findById(groupId);
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

            const isAlreadyMember = await GroupMembers.findOne({
                groupId,
                userId: user._id
            });

            if (!isAlreadyMember) {
                const newMember = await GroupMembers.create({
                    groupId,
                    userId: user._id
                });
                addedMembers.push(newMember);
            } else {
                skipped.push({ email, reason: "Already a member" });
            }
        }

        return res.status(200).json({
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