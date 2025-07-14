import mongoose from "mongoose";

const connectdb = async () => {
  mongoose.connect(process.env.mongo_url, {
    dbName: "chatApp" // or whatever you want to call your DB
  })
  .then(() => {
    console.log("database is connected");
  })
  .catch((e) => {
    console.log("error connecting to DB:", e.message);
  });
};

export default connectdb;
