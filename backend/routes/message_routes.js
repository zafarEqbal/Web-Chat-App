import express from 'express'
import {sendmessage,get_message} from "../controllers/messageController.js"
import isAuthenticated from '../middleware/isauthentication.js';
const router = express.Router();
router.route("/send/:id").post(isAuthenticated,sendmessage);
router.route("/:id").get(isAuthenticated,get_message)
export default router;
