import express,{Router, Router} from "express";
import { multerUpload } from "../Middlewares/multer.js";
import { registerUser } from "../Controllers/user.controller.js";

const router = Router();

router.route('/register')
.post(multerUpload.single('avatar'), registerUser )


export default Router;