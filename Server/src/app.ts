import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import { errorMiddleware } from "./Middlewares/error.middleware.js";


const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:3000",
    credentials: true,
}))

// All Routes Declared Here

import userRouter from "./Routes/user.routes.js"
import chatRouter from "./Routes/chat.routes.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/chat", chatRouter)

// error Middleware always put in end
app.use(errorMiddleware)
export {app}