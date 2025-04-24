import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Chlda pya a");
    // Add another log after the connection is successful
    console.log("MongoDB connection successful!");
  }) 
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    console.error("Error Details:", err.stack);
  });
app.use('/api/router',userRouter);


app.listen(3000, () => {
  console.log("Server is running on port 3000");
  // Logging the MongoDB connection string
});
