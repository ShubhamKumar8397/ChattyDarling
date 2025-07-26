import mongoose, { Document, Schema, Types } from "mongoose";
import { string } from "zod";

export interface IChat extends Document {
    _id: Types.ObjectId
    users: Types.ObjectId[];
    latestMessage: {
        text: string,
        sender: Types.ObjectId,
    };
    createdAt: Date;
    updatedAt: Date;
}


const chatSchema = new Schema<IChat>({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true,
        }
    ],

    latestMessage: {
        text: {
            type: String,
        },
        sender: {
            type : Schema.Types.ObjectId,
            ref : "User",
        }
    },

}, { timestamps: true })

chatSchema.index({users: 1, updatedAt: -1})

export const Chat = mongoose.model<IChat>("Chat", chatSchema)