import express from 'express'
import dotenv from "dotenv"
import user_routes from "./routes/user_routes.js"
import connectdb from "./config/database.js"
import cookieParser from 'cookie-parser'
import message_route from "./routes/message_routes.js"
import cors from 'cors'
import {app,server} from './Socket/socket.js'
import { initializeSocket } from './Socket/initializeSocket.js'


//const app = express();
dotenv.config({});
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.json())
const corsoption={
    origin:'https://web-chat-app-frontend-zu95.onrender.com',
    
    
    credentials:true,
}
app.use(cors(corsoption))

app.use("/api/v1/user",user_routes);
app.get("/api/v1/user/test", (req, res) => {
  res.json({ message: "Backend reachable" });
});

app.use("/api/v1/message",message_route);
server.listen(PORT,()=>{
    connectdb();
    console.log(`server is running on port ${PORT}`);
    
})

