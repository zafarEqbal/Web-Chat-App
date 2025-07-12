import express from 'express'
import dotenv from "dotenv"
import user_routes from "./routes/user_routes.js"
import connectdb from "./config/database.js"

const app = express();
dotenv.config({});
const PORT = process.env.PORT || 8080;
app.use(express.json())
// app.use("api/v1/use",register);
app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.use("/api/v1/user",user_routes)
app.listen(PORT,()=>{
    connectdb();
    console.log(`server is running on port ${PORT}`);
})

