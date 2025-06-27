import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    Sender : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required :true,
    },
    Chat : {
        type : Schema.Types.ObjectId,
        ref : "Chat",
        required : true,
    },
    attachements:[
        {
            PublicId : {
                type : String,
                required : true,
            },
            url : {
                type : String,
                required: true,
            }
        }
    ],
    content : {
        type : String,
        required : true,
    }
}, {timestamps:true})


export const Message =  mongoose.model("Message", messageSchema)