import Group from "../../models/group.Model.js";
import Message from "../../models/messages.Model.js";
import { getReciverSocketId, io } from "../../lib/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { image, text, groupId, fileLink } = req.body;
    const senderId = req.user._id;

    const group = await Group.findOne(
      {
        _id: groupId,
        "members.userId": senderId
      },
      {
        "members.$": 1 
      }
    );

    if (!group || !group.members || group.members.length === 0) {
      return res.status(404).json({ error: "Sender is not a member of the group" });
    }

    const senderRole = group.members[0].role || "member"; 

    const newMessage = new Message({
      senderId,
      senderRole,
      groupId,
      text,
      image,
      fileLink
    });

    await newMessage.save();

    io.emit("newMessage", newMessage);

    res.status(200).json(newMessage);

  } catch (error) {
    console.error("Error sending message", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { groupId } = req.body; 

    if(!groupId){
      console.log("GroupId is required")
    }

    const messages = await Message.find({ groupId })
      .sort({ createdAt: 1 })                      

    res.status(200).json(messages);

  } catch (error) {
    console.error("Error in getGroupMessages controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const createdGroups = await Group.find({ createdBy: userId });

    const memberGroups = await Group.find({
      "members.userId": userId,
      createdBy: { $ne: userId }
    });

    return res.status(200).json({
      createdGroups,
      memberGroups
    });

  } catch (err) {
    console.error("Error in getGroups:", err);
    return res.status(500).json({ message: "Server error" });
  }
};