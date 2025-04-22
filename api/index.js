import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Chlda pya a");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });


const app = express();

app.listen(3000, () => {
  console.log("server is running");
  console.log(process.env.MONGO);


});
