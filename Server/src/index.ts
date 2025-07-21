import { app } from "./app.js"
import dotenv from 'dotenv'
import { createClient } from "redis";

import connectDB from "./Database/ConnectDB.js"

dotenv.config();

const PORT = process.env.PORT || 8000

// redis Client Configure
const redisClient = createClient({
  url: process.env.REDIS_URL
});


connectDB()
    .then(() => {
        // This Return A Promise And Resolve Undefined
        // we return This Value So Waits For Connect 
        return redisClient.connect();
    })
    .then((redisConnection) => {
        if(redisConnection){
            console.log("Redis Connection Established :::: Successfully")
        }
        
        app.listen(PORT, () => {
            console.log(`Server Is Listening At PORT ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })
    
