import express, { Router } from "express"
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import { allChatsByAggregation, createNewChat, getAllChats, getAllMessage, sendMessage } from "../Controllers/chat.controllers.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = Router();

router.post("/new-chat", isAuthenticated, createNewChat)
router.get("/get-all-chats",isAuthenticated, allChatsByAggregation)
router.post('/send-message', isAuthenticated, upload.single("image"), sendMessage )
router.get('/get-all-messages/:chatId', isAuthenticated, getAllMessage)
export default router;