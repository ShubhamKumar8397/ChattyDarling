import mongoose, { Schema, Types } from "mongoose";



export interface IUSER extends Document {
    _id : Types.ObjectId
    name: string;
    email: string;
    password : string;
    authProvider: "local" | "google";
    refreshToken: string;
    profileImage?: {
        id: string
        url: string
        source: 'local' | 'google'
    }

}

const profileImageSchema = new Schema({
    id: String,
    url: String,
    source: {
        type: String,
        enum: ['local', 'google'],
        default: 'google'
    }
},
    { _id: false }
)

const userSchema = new Schema<IUSER>({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type : String,
    },
    authProvider: {
        type: String,
        enum: ['local','google'],
        required: true,
        default: "local"
    },
    profileImage: {
        type : profileImageSchema,
        required : false
    },
    refreshToken : {
        type : String,
    }

},
    { timestamps: true })

export const User = mongoose.model<IUSER>("User", userSchema)