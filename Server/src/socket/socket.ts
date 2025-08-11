"use client"
import { Server, Socket } from "socket.io"
import http from "http"
import express from "express";
import cors from "cors"
import { Chat } from "../Models/chat.model.js";

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin : "http://localhost:3000",
    credentials: true,
}))

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials:true
    }
})

const userSocketMap: Record<string, string> = {}
export const getReceiverSocketId = (receiverId :string) :string | undefined => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket: Socket) => {
    console.log("User Connected", socket.id)

    const userId = socket.handshake.query.userId as string
    if(userId && userId !== "undefined"){
        userSocketMap[userId] = socket.id
        console.log(`User ${userId} mapped with to socket ${socket.id}`)
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));



    socket.on("typing", (data) => {
        console.log(`User ${data.userId} is Typing in chat ${data.chatId}`)
        socket.to(data.chatId).emit("userTyping",{
            chatId : data.chatId,
            userId : data.userId,
        })
    })

    socket.on("stopTyping", (data) => {
        console.log(`User ${data.userId} stop Typing in ${data.chatId}`)
        socket.to(data.chatId).emit("userStoppedTyping",{
            chatId : data.chatId,
            userId : data.userId,
        })
    })

    socket.on("joinChat",(chatId) => {
        socket.join(chatId)
        console.log(`User ${userId} join To Chat ${chatId}`)
    })

    socket.on("leaveChat", (chatId) =>{
        socket.leave(chatId)
         console.log(`User ${userId} leave To Chat ${chatId}`)
    })

    socket.on("disconnect",() => {
        console.log("User Disconnected", socket.id)
        if(userId){
            delete userSocketMap[userId]
            io.emit("getOnlineUser", Object.keys(userSocketMap))
        }
    })

    socket.on("connect_error", (error) => {
        console.log("Socket connection Error", error)
    })
})

export { app, server, io }