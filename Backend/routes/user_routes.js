import express, { Router } from "express"
import {register,login,logout,getuser,sendOtp}  from "../controllers/user_controller.js"
import isAuthenticatied from "../middleware/isauthentication.js"
import { verifyEmail } from '../controllers/verifyEmail.js';
const router = express.Router()
router.post("/send-otp", sendOtp);
router.route("/register").post(register)
router.route("/login").post(login);
router.route("/logout").get(logout);
//router.get('/verify/:token', verifyEmail);
router.route("/").get(isAuthenticatied,getuser)
//router.get('/verify-email', verifyEmail);


export default router;