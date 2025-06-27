import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new Schema({
    name:{
        type: String,
        requried : true,
    },
    username:{
        type:String,
        requried: true,
        unique:true,
        lowercase : true,
        trim : true,
    },
    password:{
        type: String,
        required: true,
        select : false,
    },
    avatar:{
        publicId:{
            type: String,
            required : true,
        },
        url:{
            type : String,
            requried : true,
        }
    }
},{timestamps:true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) next()
    this.password = bcrypt.hash(this.password);
})


export const User = mongoose.model("User", userSchema)
