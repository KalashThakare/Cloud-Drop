import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    fileLink: {
      type: String,
      default: ""
    },
    isLink: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
