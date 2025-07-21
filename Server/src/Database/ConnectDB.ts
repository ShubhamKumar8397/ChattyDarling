import mongoose from "mongoose";



const connectDB = async () => {
    try {
        const dbUsername = process.env.MONGO_DB_USERNAME
        const dbPassword = process.env.MONGO_DB_PASSWORD

        const ConnectionInstance = await mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@chattydarling.d8eoysr.mongodb.net/?retryWrites=true&w=majority&appName=chattyDarling`)
        console.log("MONGODB CONNECTION ESTABLISHES ::::", ConnectionInstance.connection.host)
    } catch (error) {
        console.error("Failed To Connect To MONGODB :::", error)
        process.exit(1)
    } 
}

export default connectDB;