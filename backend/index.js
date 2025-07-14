import express from 'express'
import dotenv from "dotenv"
import user_routes from "./routes/user_routes.js"
import connectdb from "./config/database.js"
import cookieParser from 'cookie-parser'
import message_route from "./routes/message_routes.js"
import cors from 'cors'
import {app,server} from './Socket/socket.js'
import { initializeSocket } from './Socket/initializeSocket.js'
import path from "path" ;

//const app = express();
dotenv.config({});
const PORT = process.env.PORT || 8000;

const _dirname = path.resolve() ;

app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.json())
const allowedOrigins = [
  "https://web-chat-app-frontend-1o2g.onrender.com",
  "http://localhost:5173",
  "http://192.168.187.11:5173"
];

const corsoption = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsoption))

app.use("/api/v1/user",user_routes);
app.get("/api/v1/user/test", (req, res) => {
  res.json({ message: "Backend reachable" });
});

app.use("/api/v1/message",message_route);

app.use(express.static(path.join(_dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, 'dist', 'index.html'));
});



server.listen(PORT,()=>{
    connectdb();
    console.log(`server is running on port ${PORT}`);
    
})

