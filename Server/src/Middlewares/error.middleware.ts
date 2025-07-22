import { NextFunction, Request, Response } from "express";
import { ApiError } from "../Utils/ApiError.js";


export const errorMiddleware = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const statusCode = err.statusCode
  const message = err.message

  return res.json({
    success : false,
    message,
    statusCode,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  })
}