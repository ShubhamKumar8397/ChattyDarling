import {Response,  NextFunction } from "express";
import { redisClient } from "../index.js";
import { publishToQueue } from "../MailService/mail.service.js";
import { AuthenticatedRequest } from "../Middlewares/isAuthenticated.js";
import jwt, { decode, JwtPayload, TokenExpiredError } from "jsonwebtoken"
import { IUSER, User } from "../Models/User.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../Utils/generateTokens.js";
import { registerValidator } from "../Utils/reqValidatorZod.js";
import { TryCatch } from "../Utils/TryCatch.js";
import bcrypt from 'bcrypt'



// Register user
export const registerUser = TryCatch(async (req, res) => {
    // data form req.body and validate it
    const { data, error } = registerValidator.safeParse(req.body)
    if (error) {
        throw new ApiError(405, "Data Entered Wrong")
    }
    // check user in database
    const userFound = await User.findOne({ email: data.email }) as IUSER | null

    if (userFound) {
        throw new ApiError(
            401, "User Already Registered Login Please"
        )
    }

    // check rate limiting on otp before apply for new one
    const rateLimitKey = `rateLimit:${data.email}`
    const checkRateLimitForOtp = await redisClient.get(rateLimitKey);

    if (checkRateLimitForOtp) {
        throw new ApiError(405, "Otp Already Send To email")
    }

    const otp = Math.floor(100000 + Math.random() * 90000).toString();
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // save otp in redis
    const otpKey = `otp:${data.email}`
    await redisClient.set(otpKey, otp)
    await redisClient.expire(otpKey, 300)

    //  save user for sometime in redis
    const userKey = `user:${data.email}`
    await redisClient.hSet(userKey, {
        name: data.name,
        email: data.email,
        password: hashedPassword,

    })
    await redisClient.expire(userKey, 60 * 20)

    const message = {
        to: data.email,
        subject: "Your Otp Verification For Chatty Darling",
        body: `Your Otp For Chatty Darling is ${otp}. This Otp Is Expired In 5 Minutes`
    }

    // send otp to the given email
    await publishToQueue("send-otp", message)

    // set ratelimiting on otp
    await redisClient.set(rateLimitKey, 60)
    await redisClient.expire(rateLimitKey, 60)

    return res.status(200).json(
        new ApiResponse("Partial Register Complete", " ", 200)
    )

})

// verify user By Otp
export const verifyUserAndRegister = TryCatch(async (req, res) => {
    // Data From Req.body
    const { email, otp: enteredOtp } = req.body;
    if (!email || !enteredOtp) {
        throw new ApiError(404, "Please Send Email And Otp")
    }

    // get user from redis
    const userKey = `user:${email}`
    const redisUser = await redisClient.hGetAll(userKey);
    if (Object.keys(redisUser).length === 0) {
        throw new ApiError(404, "Register Again")
    }

    // get otp form redis
    const otpKey = `otp:${email}`
    const otpToken = await redisClient.get(otpKey)
    if (!otpToken) {
        throw new ApiError(405, "OTP Expired Resend Otp")
    }

    // match entered otp and otpToken from redis
    if (enteredOtp !== otpToken) {
        throw new ApiError(401, "OTP Enter Wrong")
    }

    // check user already exits in database
    const userExists = await User.findOne({ email }) as IUSER | null
    if (userExists) {
        throw new ApiError(403, "User Already Exist! Login Please")
    }

    // userCreated In Database
    const userCreated = await User.create({
        name: redisUser.name,
        email: redisUser.email,
        password: redisUser.password,
        authProvider: 'local'
    })

    if (!userCreated) {
        throw new ApiError(503, "User Not Registerd")
    }

    // delete redisKeys 
    await redisClient.del(otpKey);
    await redisClient.del(userKey);

    return res.status(200).json(
        new ApiResponse("Register User Successfully & Verified",
            {
                name: userCreated.name,
                email: userCreated.email,
                authenticatedBy: userCreated.authProvider
            },
            200
        )
    )

})

// resendOtp
export const resendOtp = TryCatch(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(404, "Email Not Found")
    }

    // check rate limit on otp 
    const rateLimitKey = `rateLimit:${email}`
    const checkRateLimitForOtp = await redisClient.get(rateLimitKey);

    if (checkRateLimitForOtp) {
        throw new ApiError(405, "Otp Already Send To email")
    }

    // if user is available in redis for verifcation then do otherthings
    const userKey = `user:${email}`
    const checkUserAvailable = await redisClient.hGetAll(userKey)
    if (Object.keys(checkUserAvailable).length === 0) {
        throw new ApiError(404, "Please Register Again ! For A lot of Time You On This")
    }
    await redisClient.expire(userKey, 60 * 20);

    const otp = Math.floor(100000 + Math.random() * 90000).toString();

    // save New Otp to redis and expiration
    const otpKey = `otp:${email}`
    await redisClient.set(otpKey, otp)
    await redisClient.expire(otpKey, 300)

    const message = {
        to: email,
        subject: "Your Otp Verification For Chatty Darling",
        body: `Your Otp For Chatty Darling is ${otp}. This Otp Is Expired In 5 Minutes`
    }

    // send otp to the given email
    await publishToQueue("send-otp", message)

    // set ratelimiting on otp
    await redisClient.set(rateLimitKey, 60)
    await redisClient.expire(rateLimitKey, 60)

    return res.status(200).json(
        new ApiResponse("Resend OTP Successfully", "", 200)
    )

})

// LoginUser
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(404, "Fill Data Correctly")
    }

    // check login rate-limiting with wrong password;
    const loginTryCount = `loginCount:${email}`
    let attempts;
    attempts = await redisClient.get(loginTryCount)
    if (Number(attempts) > 6) {
        throw new ApiError(
            407, "Too Many Request With Wrong Password Try 15 min Later"
        )
    }

    // find user in Database
    const user = await User.findOne({ email })
    if (!user || !(user.authProvider == "local")) {
        throw new ApiError(404, "User Not Found : Register Now")
    }

    // check entered password is Correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        // rate limiting applying on login
        attempts = await redisClient.incr(loginTryCount)
        if (attempts == 1) {
            await redisClient.expire(loginTryCount, 60 * 10)
        }

        throw new ApiError(401, "Password Entered Wrong")
    }


    // make Tokens
    const refreshToken = generateRefreshToken({ _id: user._id })
    const accessToken = generateAccessToken({ _id: user._id, name: user.name, email: user.email })

    if (!refreshToken || !accessToken) {
        throw new ApiError(504, "Tokens Not Generate")
    }

    // save refreshToken To Db
    const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { $set: { refreshToken } },
        {
            new: true,
            select: '-password -refreshToken'
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    await redisClient.del(loginTryCount)

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse("Login User successfully", updatedUser, 200)
        )


})

// get current user
export const getCurrentUser = TryCatch(async(req:AuthenticatedRequest, res, next) => {
    const user = req.user
    if(!user){
        throw new ApiError(404, "User Not Found")
    }

    return res.status(200).json(
        new ApiResponse("Current User Fetched Successfully ::", user, 200)
    )
})

// Refresh Access Token By Refresh Token
export const refresAcessToken = TryCatch(async(req , res , next) => {
    const refreshTokenRequest = req.cookies.refreshToken
    if(!refreshTokenRequest){
        throw new ApiError(404, "Tokens Not Found! Login Again")
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(refreshTokenRequest, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            return next(new ApiError(401, "Refresh Token Expired! Login Again "))
        }
    }
    
    if(!decodedToken || !decodedToken.user){
        throw new ApiError(403, "Unauthorized Token Expired! Login Again")
    }

    const user = await User.findById(decodedToken.user._id).select("-password -refreshToken") 
    if(!user){
        throw new ApiError(404, "User Not Found!!")
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken({ _id: user._id })

    if(!accessToken || !refreshToken){
        throw new ApiError(501, "Server ERR:: During Refresh Access Token")
    }

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse("Access Token Refreshed", "", 201 )
        )
})

// get Any Desired User
 

