import {Schema, model} from "mongoose";

const postSchema = new Schema({
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
    caption:{
        type:String,
        default:""
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            type:Schema.Types.ObjectId, 
            ref:"Comment"
        }
    ]
},{timestamps:true});

const Post = model("Post",postSchema);
export default Post;

