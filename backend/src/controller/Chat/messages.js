import Group from "../../models/group.Model.js";
import Message from "../../models/messages.Model.js";
import { getReciverSocketId, io } from "../../lib/socket.js";

export const sendMessage = async (req, res) => {

  try {

    const { image, text } = req.body;
    const senderId = req.user._id;
    const {groupId} = req.body; 
    const {fileLink} = req.body;

    const newMessage = new Message({
      senderId,
      groupId,
      text,
      fileLink
    });

    await newMessage.save();

    io.emit("newMessage", newMessage); // simple global broadcast


    res.status(200).json(newMessage);

  } catch (error) {

    console.log("Error sending message",error);
    res.status(500).json({ error: "Internal server error" });
  }

}

export const getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;  // Group ID from URL

    const messages = await Message.find({ groupId })
      .sort({ createdAt: 1 })                         // Sort

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