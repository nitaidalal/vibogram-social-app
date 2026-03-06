import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        default: "text"
    }
}, { timestamps: true });

const Message = model("Message", messageSchema);
export default Message;