import {Schema, model} from "mongoose";

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
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
        author: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          require: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reports: [
      {
        reportedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reason: {
          type: String,
          enum: ["Spam", "Nudity or Sexual Content", "Harassment or Bullying", "Violence or Dangerous Content", "Misinformation", "Hate Speech", "Other"],
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

postSchema.index({ createdAt: -1, _id: -1 });

const Post = model("Post",postSchema);
export default Post;

