import express, { Router } from "express"
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import { allChatsByAggregation, createNewChat, getAllChats, sendMessage } from "../Controllers/chat.controllers.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = Router();

router.post("/new-chat", isAuthenticated, createNewChat)
router.get("/get-all-chats",isAuthenticated, allChatsByAggregation)
router.post('/send-message', isAuthenticated, upload.single("image"), sendMessage )

export default router;