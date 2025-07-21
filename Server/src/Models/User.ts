import mongoose, {Schema} from "mongoose";

export interface IUSER extends Document{
    name : string;
    email : string;
}

const userSchema = new Schema<IUSER>({
    name : {
        type : String,
        lowercase : true,
        trim : true,
        requried : true,
    },
    email :{
        type : String,
        lowercase : true,
        required : true,
        trim : true,
        unique: true,
    }
},{timestamps : true})

export const User = mongoose.model<IUSER>("User", userSchema)