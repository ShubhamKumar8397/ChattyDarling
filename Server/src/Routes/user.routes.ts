import express, { Router } from "express"
import { verifyUserAndRegister, registerUser, resendOtp, loginUser, getCurrentUser, refresAcessToken } from "../Controllers/user.controllers.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import { createNewChat } from "../Controllers/chat.controllers.js";

const router = Router();

router.post('/register-user', registerUser)
router.post('/verify-user', verifyUserAndRegister)
router.post('/resend-otp', resendOtp )
router.post('/login-user',loginUser)
router.get('/get-current-user', isAuthenticated ,getCurrentUser)
router.post('/refresh-access-token', refresAcessToken)


export default router;