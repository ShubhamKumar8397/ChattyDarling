import express from "express";
import connectDB from "./utils/features.js";
import dotenv from "dotenv"

const app = express();

dotenv.config({
    path : "./.env",
})

// using middlewaresThere
app.use(express.json());    //json data lene ke liye from frontend
app.use(express.urlencoded());


const port = process.env.PORT || 3000


connectDB()
.then(() => app.listen(port, () => {
    console.log(`Server is Listening At :: port ${port}...`)
}))

