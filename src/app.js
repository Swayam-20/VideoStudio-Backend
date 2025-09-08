import dotenv from "dotenv";
// require("dotenv").config({ path: "./env" });
import  connectDB  from "./db/index.js";
import {appp} from "./appp.js";
dotenv.config({ path: "./.env" });

connectDB()
.then(() => {
    const port =process.env.PORT || 8000;
    appp.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log("Database connection successful");
    appp.get("connected", (req, res) => {
        res.send("Connected to the database successfully!");
    });
})
.catch((error) => {
    console.error("Database connection failed:", error);
}
);















/*
import express from "express";

const appp = express();
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        appp.on("error", (err) => {
            console.error("Connection error:", err);
            throw error;
        }   );

        appp.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
        }
        catch (error)
        {
        console.error("Database connection failed:", error);
        }

})()
        */