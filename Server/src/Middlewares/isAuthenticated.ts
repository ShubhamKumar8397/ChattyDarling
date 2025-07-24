import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { IUSER, User } from "../Models/User.js";


export interface AuthenticatedRequest extends Request {
    user?: IUSER | null
}

export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.accessToken
        if (!token) {
            throw new ApiError(404, "Your Are Not Authenticated")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload

        if (!decodedToken || !decodedToken.user) {
            throw new ApiError(407, "Access Token Expired")
        }

        const user = await User.findById(decodedToken.user._id).select("-password -refreshToken") as IUSER
        if (!user) {
            throw new ApiError(404, "User Removed! Signup Again")
        }

        req.user = user;
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new ApiError(401, "Access token has expired"));
        }

        // handle other errors
        next(error)
    }
}