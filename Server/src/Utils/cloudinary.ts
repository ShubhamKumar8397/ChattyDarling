import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { ApiError } from './ApiError.js';
import dotenv from "dotenv"

dotenv.config()

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


export const uploadImageOnCloudinary = async (filePath: any) => {
    try {
        if (!filePath) throw new ApiError(401, "File Path Not Received")
        const uploadResult = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        return uploadResult;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(filePath)
        throw new ApiError(
            404, "Send Image Failed"
        )
    }
}
