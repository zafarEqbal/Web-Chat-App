import mongoose from "mongoose";
const connectdb= async()=>{
    mongoose.connect(process.env.mongo_url).then(()=>{
        console.log("database is connected")
    }).catch((e)=>{
        console.log("error")
    })
}
export default connectdb;
