import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET  

})

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params:{
        folder: 'chat-images',
        allowed_types : ["jpg", "jpeg", "png", "gif", "wepb"],
        transformation:[
            {width : 800, height:600, crop:"limit"},
            {quality: 'auto'}
        ]
    } as any,
})


