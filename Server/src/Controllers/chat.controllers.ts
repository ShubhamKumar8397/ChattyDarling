import mongoose from "mongoose";
import { AuthenticatedRequest } from "../Middlewares/isAuthenticated.js";
import { Chat, IChat } from "../Models/chat.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { TryCatch } from "../Utils/TryCatch.js";
import { Message } from "../Models/message.model.js";
import { User } from "../Models/User.js";
import { uploadImageOnCloudinary } from "../Utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


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
                existingChat,
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

// get all chats by aggregation
export const allChatsByAggregation = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(404, "UserId Not Found!!")

    const data = await Chat.aggregate([
        // wo sare chat jisme users array me ek userId ye bhi ho
        {
            $match: {
                users: userId
            }
        },
        // updated chat jo recent update hui ho
        {
            $sort: {
                updatedAt: -1
            }
        },
        // jo users array hai usme me se another user nikalo
        {
            $addFields: {
                receiverUserId: {
                    // filter give a array so usme se first element
                    $first: {
                        $filter: {
                            input: "$users",
                            as: "user",
                            cond: { $ne: ["$$user", userId] }
                        }
                    }
                },
                currentUserId: userId
            }
        },
        // receiver ka userdata With lookup
        {
            $lookup: {
                from: "users",
                localField: "receiverUserId",
                foreignField: "_id",
                as: "receiverUserData",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                        }
                    }
                ]

            }
        },
        // array to object conversion
        {
            $unwind: "$receiverUserData"
        },
        // lookup in messages to get unseen messages
        {
            $lookup: {
                from: "messages",
                let: {
                    chatId: "$_id",   //$_id is the id of Chat it can be named Any thing pappu In Which i Aggreagte // $chatId  is the chatId in message
                    currentUserId: "$currentUserId"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$chatId", "$$chatId"] },   //messages me - chatId , hai aur hum Chats me aggreagate kre rhe hai abhi usme hai _id so let check
                                    { $ne: ["$sender", "$$currentUserId"] }, //agar sender me hi hu to mere liye unseen kaise
                                    { $eq: ["$seen", false] }
                                ]
                            }
                        }
                    },
                    {
                        $count: "unseenCount"
                    }
                ],
                as: "unseenMessages"
            }
        },
        {
            $unwind: {
                path: "$unseenMessages",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                unseenCount: { $ifNull: ["$unseenMessages.unseenCount", 0] }
            }
        }
    ])

    return res.status(200).json({
        data
    })

})

// sendMessage 
export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body
    const imageFile = req?.file
    console.log(imageFile)

    if (!senderId) throw new ApiError(401, "Unauthorized")
    if (!chatId) throw new ApiError(401, "Chat Id Required");
    if (!text && !imageFile) throw new ApiError(401, "Either Text Or Image Not Found");

    // find room in which message send
    const chat = await Chat.findById(chatId);
    if (!chat) throw new ApiError(404, "Chat Not Found")

    // to check ki sender apne chat me hi message kr rha hai na
    const isUserInChat = chat.users.some((userId) => userId.toString() === senderId.toString())
    if (!isUserInChat) throw new ApiError(403, "You Are Not Participant Of This Chat");

    // loggedin user ke equal id nhi hai to wo receiver user hi hoga
    const otherUserId = chat.users.find((userId) => userId.toString() !== senderId.toString())
    if (!otherUserId) throw new ApiError(404, "No Other User");

    // Socket Setuppppppp later =========================================================
    const receiverSocketId = getReceiverSocketId(otherUserId?.toString())
    let isReceiverInChatRoom = false;

    if(receiverSocketId){
        const receiverSocket = io.sockets.sockets.get(receiverSocketId)
        if(receiverSocket && receiverSocket.rooms.has(chatId)){
            isReceiverInChatRoom = true;
        }
    }

    // console.log("ioSockets", io.sockets)
    // console.log("io.sockets.sockets", io.sockets.sockets)


    

    // cloudinary setup

    let uploadResults:any;
    if(imageFile){
        uploadResults = await uploadImageOnCloudinary(imageFile.path)
    }

    let messageData: any = {
        chatId: chatId,
        sender: senderId,
        seen: isReceiverInChatRoom,
        seenAt: isReceiverInChatRoom ? new Date() : undefined,
    };

    if (imageFile) {
        messageData.image = {
            url: uploadResults.url,
            publicId:uploadResults.public_id ,
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

    // emits to socket socket ===================================================================

    io.to(chatId).emit("newMessage", savedMessage)
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", savedMessage)
    }

    const senderSocketId = getReceiverSocketId(senderId.toString())
    if(senderSocketId){
        io.to(senderSocketId).emit("newMessage")
    }

    if(isReceiverInChatRoom && senderSocketId){
        io.to(senderSocketId).emit("messagesSeen", {
            chatId: chatId,
            seenBy: otherUserId,
            messageIds: [savedMessage._id]
        })
    }

    res.status(201).json({
        message: savedMessage,
        sender: senderId
    })

})

// get All Messages Of A User
export const getAllMessage = TryCatch(async (req: AuthenticatedRequest, res, next) => {
    const { chatId } = req.params
    if(!chatId) throw new ApiError(404, "Dont Get chat Id")
    
    // check The chat is Available or not
    const chat = await Chat.findById(chatId);
    if(!chat) throw new ApiError(404, "Chat Is Invalid")
    
    // check the authetic user is available in The chat or do unauthorized work
    const isUserInChat = chat?.users.some((userId) => userId.toString() === req?.user?._id.toString())
    if(!isUserInChat) throw new ApiError(401, "Unauthorized way of Sending req")

    // get userId of Receiver
    const receiverUserId = chat?.users.filter((userId) => userId.toString() !== req?.user?._id.toString())

    // agar user of select kra hai tabhi to request aayi so we do all the messages seen
    const messageMarkAsSeen = await Message.find({
        chatId : chatId,
        sender:{$ne : req.user?._id},
        seen: false,
    })

    await Message.updateMany({
        // code for docuement fidn which follow these
        chatId: chatId,
        sender:{$ne : req?.user?._id},
        seen:false,
    },
    {
        // what you wan to update in the code
        seen: true,
        seenAt: Date.now()
    }
)

    // get the all messages of this chat by aggregation
    const data =await Chat.aggregate([
        {
            $match: {
               _id: new mongoose.Types.ObjectId(chatId)
            }
        },
        {
            $sort:{
                updatedAt : -1
            }
        },
        {
            $lookup:{
                from : "messages",
                localField: "_id",
                foreignField: "chatId",
                as:"allMessages"
            }
        },
        {
            $addFields:{
                allMessage: "$allMessages"
            }
        },
        {
            $project:{
                _id : 1,
                allMessage : 1
            }
        }
        
    ])

    // sockeet implementation

    if(messageMarkAsSeen.length > 0){
        const otherUserSocketId = getReceiverSocketId(receiverUserId.toString())
        if(otherUserSocketId){
            io.to(otherUserSocketId).emit("messagesSeen",{
            chatId: chatId,
            seenBy: req?.user?._id,
            messageIds: messageMarkAsSeen.map((msg) => msg._id)
        })
        }
    }


    
   return res.status(200).json({
    data: data[0]
   })
})



