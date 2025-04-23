import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

mongoose.connect("mongodb+srv://anas:anas123456@mern-estate-cluster0.qvkxhyt.mongodb.net/mern-estate?retryWrites=true&w=majority&appName=mern-estate-cluster0")
  .then(() => {
    console.log("Chlda pya a");
    // Add another log after the connection is successful
    console.log("MongoDB connection successful!");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    console.error("Error Details:", err.stack);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("MongoDB URL: ", process.env.MONGO);  // Logging the MongoDB connection string
});
