import GroupMembers from "../../models/group-member.Model";
import group from "../../models/group.Model";
import Message from "../../models/messages.Model";

export const sendMessage = async (req, res) => {

    try {

        const { image, text } = req.body;
        const senderId = req.user._id;
        const groupId = req.params; // point to note how to send this groupId
        const fileLink = req.body;

        const newMessage = new Message({
            senderId,
            groupId,
            text,
            fileLink
        });

        await newMessage.save();

        res.status(200).json(newMessage);

    } catch (error) {

        console.log("Error sending message");
        res.status(500).json({error:"Internal server error"});
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
      const userId = req.user._id; 
  
      const createdGroups = await group.find({ createdBy: userId });
  
      const memberGroups = await GroupMembers.find({ userId })
        .populate("groupId")
        .then((memberships) =>
          memberships
            .map((m) => m.groupId)
            .filter((group) => group.createdBy.toString() !== userId.toString())
        );
  
      return res.status(200).json({
        createdGroups,
        memberGroups
      });
    } catch (err) {
      console.error("Error in getGroups:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  