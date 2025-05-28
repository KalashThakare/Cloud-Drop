import Group from "../../models/group.Model.js";
import User from "../../models/user.Model.js";
import { io } from "../../lib/socket.js";

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
        
        // Populate the savedGroup with user details for frontend
        await savedGroup.populate('createdBy', 'email username');
        await savedGroup.populate('members.userId', 'email username');
        
        io.emit("newGroupCreated", savedGroup);

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
        const { groupId } = req.body;
        let { emails } = req.body;

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

            const newMember = {
                email,
                userId: user._id,
                joinedAt: new Date()
            };

            group.members.push(newMember);
            addedMembers.push({ 
                email, 
                userId: user._id,
                username: user.username || user.email // Include username for frontend
            });
        }

        await group.save();

        // Emit event for each added member with complete user info
        for (const user of addedMembers) {
            io.emit("userAddedToGroup", {
                groupId,
                user,
            });
        }

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

        const { memberId, groupId } = req.body;
        const userId = req.user._id;

        console.log("Removing member:", { memberId, groupId, requesterId: userId });
        
        if (!memberId) {
            return res.status(400).json({ message: "memberId is required" });
        }
        
        if (!groupId) {
            return res.status(400).json({ message: "groupId is required" });
        }

        if (!memberId) {
            return res.status(400).json({ message: "Please provide member Id" });
        }

        if (!groupId) {
            return res.status(400).json({ message: "Please provide group Id" });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (memberId.toString() === group.createdBy.toString()) {
            return res.status(403).json({ message: "You cannot remove yourself" });
        }

        const originalCount = group.members.length;

        group.members = group.members.filter(member => member.userId.toString() !== memberId.toString());

        if (group.members.length === originalCount) {
            return res.status(404).json({ message: "Member not found in group" });
        }

        await group.save();

        console.log("Emitting userRemovedFromGroup:", { groupId, userId: memberId });
        io.emit("userRemovedFromGroup", {
            groupId,
            userId: memberId
        });

        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        console.error("Error removing member:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const assignRole = async (req, res) => {
    try {
        const { role, groupId, memberId } = req.body;
        const userId = req.user._id;

        console.log("Assigning role:", { role, groupId, memberId, requesterId: userId });

        if (!role) {
            return res.status(400).json({ message: "Role that is to assign is required" });
        }
        if (!groupId) {
            return res.status(400).json({ message: "GroupID is required" });
        }
        if (!userId) {
            return res.status(400).json({ message: "UserID is required" });
        }
        if (!memberId) {
            return res.status(400).json({ message: "memberID is required" });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "No group found" });
        }

        if (group.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You don't have permission to assign roles" });
        }

        const memberIndex = group.members.findIndex(
            member => member._id.toString() === memberId
        );

        if (memberIndex === -1) {
            return res.status(404).json({ message: "No member found" });
        }

        group.members[memberIndex].role = role;

        await group.save();

        const updatedMember = group.members[memberIndex];

        console.log("Emitting roleUpdated:", { groupId, memberId, role });
        io.emit("roleUpdated", {
            groupId,
            memberId,
            role,
            updatedMember
        });

        return res.status(200).json({
            success: true,
            message: "Role assigned successfully",
            updatedMember: updatedMember
        });

    } catch (error) {
        console.error("Error in assignRole:", error);
        return res.status(500).json({
            message: "An error occurred while assigning the role",
            error: error.message
        });
    }
}

export const exitGroup = async (req, res) => {
    try {
        const userId = req.user._id;
        const { groupId } = req.params;

        if (!userId) {
            return res.status(404).json({ message: "Unauthorised" });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const originalCount = group.members.length;

        group.members = group.members.filter(member => member.userId.toString() !== userId.toString());

        if (group.members.length === originalCount) {
            return res.status(404).json({ message: "Member not found in group" });
        }

        await group.save();

        // Emit event when user exits group
        io.emit("userRemovedFromGroup", {
            groupId,
            userId: userId.toString()
        });

        res.status(200).json({ message: "Exit successful" });

    } catch (error) {
        console.error("error in exit group controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const terminateGroup = async (req, res) => {
    try {
        const userId = req.user._id;
        const { groupId } = req.body;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (userId.toString() === group.createdBy.toString()) {
            await Group.findByIdAndDelete(groupId);
            
            console.log("Emitting groupDeleted:", { groupId });
            io.emit("groupDeleted", {
                groupId
            });
            
            return res.status(200).json({ message: "Project terminated successfully" });
        } else {
            return res.status(404).json({ message: "Only group admin can terminate the group" });
        }

    } catch (error) {
        console.error("Error in terminateGroup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}