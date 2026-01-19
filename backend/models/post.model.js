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
            author:{
                type:Schema.Types.ObjectId, 
                ref:"User"
            },
            content:{
                type:String,
            require:true
            }
            
        }
    ]
},{timestamps:true});

const Post = model("Post",postSchema);
export default Post;

