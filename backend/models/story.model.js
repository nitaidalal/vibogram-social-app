import {Schema,mode, model} from "mongoose";

const storySchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    mediaType:{
        type:String,
        enum:["image","video"],
        require:true
    },
    mediaUrl:{
        type:String,
        require:true
    },
    viewers:[
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now,
        expires:86400 // 24 hours
    }
},{timestamps:true});

const Story = model("Story",storySchema);
export default Story;