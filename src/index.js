import dotenv from "dotenv";
// require("dotenv").config({ path: "./env" });
import  connectDB  from "./db/index.js";

dotenv.config({ path: "./.env" });
connectDB()
















/*
import express from "express";

const app = express();
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", (err) => {
            console.error("Connection error:", err);
            throw error;
        }   );

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
        }
        catch (error)
        {
        console.error("Database connection failed:", error);
        }

})()
        */