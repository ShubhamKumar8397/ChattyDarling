import { redisClient } from "../index.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { publishToQueue } from "../Utils/rabbitmq.js";
import { TryCatch } from "../Utils/TryCatch.js";


export const loginUser = TryCatch(async(req , res) => {
    const {email} = req.body

    const rateLimitKey = `otp:ratelimit:${email}`
    const rateLimit = await redisClient.get(rateLimitKey)
    if(rateLimit){
        throw new ApiError(429, "Too Many Request. Please Wait For Requesting New")
    }


    const otp = Math.floor(100000 + Math.random() * 90000).toString();
    

    const otpKey = `otp:${email}`
    await redisClient.set(otpKey, otp , {EX : 300})

    await redisClient.set(rateLimitKey, "true", {
        EX : 60,
    })

    const message = {
        to : email,
        subject : "Your OTP Code",
        body : `Your OTP is ${otp}. It is Valid Only for 5 minutes`
    }

    await publishToQueue("send-otp", message)

    return res.status(200).json(
        new ApiResponse("Login Successfully" ,'', 200)
    )
    
})