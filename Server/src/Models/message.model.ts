import mongoose, {Document, Schema, Types} from "mongoose";


export interface IMessage extends Document{
    chatId : Types.ObjectId;
    sender : Types.ObjectId;
    text?:string;
    image?:{
        url : string;
        publicId : string;
    }
    messageType : "text" | "image"
    seen : boolean;
    seenAt?: Date;
    createdAt: Date;
    updateAt : Date;
}


const messageSchema = new Schema<IMessage>({
    chatId : {
        type : Schema.Types.ObjectId,
        ref : "Chat",
        required : true,
    },
    sender:{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    text:String,
    image : {
        url : String,
        publicId : String
    },
    messageType : {
        type : String,
        enum : ["text" , "image"],
        default : "text",
    },
    seen: {
        type : Boolean,
        default : true,
    },
    seenAt:{
        type : Date,
        default : null
    }
}, {timestamps:true})

messageSchema.index({ chatId: 1, sender: 1, seen: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema)