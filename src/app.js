import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors(// this is used to enable CORS (Cross-Origin Resource Sharing)
    {
        origin: process.env.CLIENT_URL ,
        credentials: true,
    }
));
// this is use to handle input data from the client side
app.use(express.json( 
    {
        limit: "50kb",
    }
));
app.use(express.urlencoded( 
    {
        limit: "50kb",
        extended: true,
    }
));
app.use(cookieParser()); // this is used to parse cookies from the client side
// cookies parsing is used to handle authentication and other features that require cookies
// this is used to handle cookies from the client side

app.use(express.static("public")); // this is used to serve static files from the public directory


// router 
import userRouter from "./routes/user.routes.js";
import commentrouter from "./routes/comment.routes.js"; // this is used to handle video related routes
app.use("/api/v1/users", userRouter); // this is used to handle user related routes
app.use("/api/v1/comments",commentrouter); // this is used to handle video related routes
export {app};