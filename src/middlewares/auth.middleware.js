import jwt  from "jsonwebtoken";
import asynchandeler from "../utils/asynchandler.js";
import Apierror from "../utils/ApiError.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});


const verifyJWT = asynchandeler(async(req, _, next) => {
    // this middleware is used to verify the JWT token

    try {
        const token =req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
        // console.log("TOKEN")
        if(!token){
            throw new Apierror("You are not authorized to access this resource", 401);
        }
        const verifytoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) // decodedtoken
        
        const user = await User.findById(verifytoken._id).select("-password -refreshToken");
        if(!user){
            throw new Apierror("Inavlid access token", 404);
        }
        req.user = user;
        // console.log(user)
        next();

    } catch (error) {
        throw new Apierror(error?.message || "Internal Server Error", error?.status || 500);
    }

    })
export default verifyJWT;