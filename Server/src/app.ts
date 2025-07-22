import express from "express";
import { errorMiddleware } from "./Middlewares/error.middleware.js";

const app = express();

app.use(express.json())

// All Routes Declared Here

import userRouter from "./Routes/user.routes.js"

app.use("/api/v1/user", userRouter)


// error Middleware always put in end
app.use(errorMiddleware)
export {app}