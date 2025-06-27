import mongoose from "mongoose"
import dotenv from "dotenv"




const connectDB = async () => {
    
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}`)
        console.log(`DataBase Connected Successfully...` , connectionInstance.connection.host);
    } catch (error) {
        console.log("ERRR:::: DataBase Connection Failed :" , error );
        process.exit(1)
    }
}

export default connectDB;