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
      author:{
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      content:{
        type: String,
        require: true,
    }
  }
  ],
}, { timestamps: true });

const Vibe = model("Vibe", VibeSchema);
export default Vibe;