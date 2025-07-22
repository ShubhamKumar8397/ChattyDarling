import express, { Router } from "express"
import { loginUser } from "../Controllers/user.controllers.js";

const router = Router();

router.post('/login', loginUser)

export default router;