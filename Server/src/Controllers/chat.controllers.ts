import mongoose from "mongoose";
import { AuthenticatedRequest } from "../Middlewares/isAuthenticated.js";
import { Chat, IChat } from "../Models/chat.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { TryCatch } from "../Utils/TryCatch.js";
import { Message } from "../Models/message.model.js";
import { User } from "../Models/User.js";

// create new chat
export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const userId = req.user?._id
    const { otherUserId } = req.body;

    if (!otherUserId) {
        throw new ApiError(404, "Others User Id is Required")
    }

    // check Already these Two Member Chat room Available
    const existingChat = await Chat.findOne({
        users: {
            $all: [userId, otherUserId],
            $size: 2
        }
    })

    // if chat room exist with two member then not new created
    if (existingChat) {
        return res.status(200).json(
            new ApiResponse(
                "Chat Already Exists",
                { chatId: existingChat._id },
                200
            )
        )
    }

    // if no new chat room then create a new one
    const newChat = await Chat.create({
        users: [userId, otherUserId]
    }) as IChat

    if (!newChat) {
        throw new ApiError(501, "Server chat!! Chat Not Formed")
    }

    res.status(201).json(
        new ApiResponse(
            "new Chat Created",
            { chatId: newChat._id },
            201
        )
    )


})

// fetch all chats
export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(404, "User Id Missing")
    }

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 })

    const chatWithUserData = await Promise.all(
        // check later
        chats.map(async (chat) => {
            const otherUserId = chat.users.find((id) => id.toString() !== userId.toString())
            const unseenCount = await Message.countDocuments({
                chatId: chat._id,
                sender: { $ne: userId },
                seen: false,
            })

            const user = await User.findById(otherUserId)
            return {
                user: user,
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                }
            }
        })
    )

    return res.json({
        message: "chats",
        data: chatWithUserData
    })
})

// sendMessage 
export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body
    const imageFile = req?.file

    if (!senderId) {
        throw new ApiError(401, "Unauthorized")
    }

    if (!chatId) {
        throw new ApiError(401, "Chat Id Required")
    }

    if (!text && !imageFile) {
        throw new ApiError(401, "Either Text Or Image Not Found")
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new ApiError(404, "Chat Not Found")
    }

    // to check ki sender apne chat me hi message kr rha hai na
    const isUserInChat = chat.users.some((userId) => userId.toString() === senderId.toString())

    if (!isUserInChat) {
        throw new ApiError(403, "You Are Not Participant Of This Chat")
    }

    // loggedin user ke equal id nhi hai to wo receiver user hi hoga
    const otherUserId = chat.users.find((userId) => userId.toString() !== senderId.toString())
    if (!otherUserId) {
        throw new ApiError(404, "No Other User")
    }

    // Socket Setuppppppp later


    let messageData: any = {
        chatId: chatId,
        sender: senderId,
        seen: false,
        seenAt: undefined,
    };

    if (imageFile) {
        messageData.image = {
            url: imageFile.path,
            publicId: imageFile.filename,
        }
        messageData.messageType = "image"
        messageData.text = text || ""
    } else {
        messageData.text = text;
        messageData.messageType = "text";
    }


    const message = new Message(messageData);
    const savedMessage = await message.save();

    const latestMessageText = imageFile ? "📷 Image" : text

    console.log(senderId)

    await Chat.findByIdAndUpdate(chatId, {
        $set: {
            latestMessage: {
                sender: senderId.toString(),
                text: latestMessageText,

            },
            updatedAt: new Date()
        }
    },
        {
            new: true
        }
    )

    // emits to socket

    res.status(201).json({
        message: savedMessage,
        sender: senderId
    })

})


