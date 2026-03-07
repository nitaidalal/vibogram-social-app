import { Schema, model } from "mongoose";

const conversationSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    deletedFor: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    // Tracks when each user last cleared/deleted the conversation
    // Messages created before this timestamp are hidden for that user
    clearedAt: {
        type: Map,
        of: Date,
        default: {}
    },
}, { timestamps: true });

conversationSchema.index({ participants: 1 }); // For efficient retrieval of conversations for a user

const Conversation = model("Conversation", conversationSchema);
export default Conversation;
