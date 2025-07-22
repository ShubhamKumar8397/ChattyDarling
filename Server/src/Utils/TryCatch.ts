import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "./ApiError.js";


const TryCatch = (handler: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error: any) {
            if (!(error instanceof ApiError)) {
                error = new ApiError(error?.statusCode || 500, error.message || "Internal Server Error", [], error.stack);
            }
            next(error);
        }
    }
}


export { TryCatch };