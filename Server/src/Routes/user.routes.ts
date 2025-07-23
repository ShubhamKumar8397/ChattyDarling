import express, { Router } from "express"
import { verifyUserAndRegister, registerUser, resendOtp, loginUser } from "../Controllers/user.controllers.js";

const router = Router();

router.post('/register-user', registerUser)
router.post('/verify-user', verifyUserAndRegister)
router.post('/resend-otp', resendOtp )
router.post('/login-user',loginUser)

export default router;