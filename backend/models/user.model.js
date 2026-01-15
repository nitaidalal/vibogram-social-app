import {Schema,model} from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true 
    },
    password:{
        type:String,
        require:true
    },
    profileImage:{
        type:String,
        default:""
    },
    followers:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    savedPosts:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    vibes:[
        {
            type:Schema.Types.ObjectId,
            ref:"Vibe"
        }
    ],
    story:{
        type:Schema.Types.ObjectId,
        ref:"Story"
    },
    resetOtp:{ //for forgot password
        type:String,
        default:""
    },
    otpExpiry:{
        type:Date,
        default:null
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

const User = model("User",userSchema); 
export default User;