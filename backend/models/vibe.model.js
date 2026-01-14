import {Schema,model} from 'mongoose';

const VibeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  mediaUrl: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    default: "",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
}, { timestamps: true });

const Vibe = model("Vibe", VibeSchema);
export default Vibe;