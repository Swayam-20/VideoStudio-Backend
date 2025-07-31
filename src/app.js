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
import likeRouter from "./routes/like.routes.js"; // this is used to handle like related routes
import videoRouter from "./routes/video.routes.js"; // this is used to handle video related routes
import tweetRouter from "./routes/tweet.routes.js"; // this is used to handle tweet related routes
import dashboardRouter from "./routes/dashboard.routes.js"; // this is used to handle dashboard related routes
import  healthcheckRouter   from "./routes/healthcheck.routes.js"; // this is used to handle healthcheck related routes
import subscriptionRouter from "./routes/subscription.routes.js"; // this is used to handle subscription related routes
app.use("/api/v1/users", userRouter); // this is used to handle user related routes
app.use("/api/v1/comments",commentrouter); // this is used to handle video related routes
app.use("/api/v1/likes", likeRouter); // this is used to handle like related routes
app.use("/api/v1/videos", videoRouter); // this is used to handle video related routes
app.use("/api/v1/tweets", tweetRouter); // this is used to handle tweet related routes
app.use("/api/v1/dashboard", dashboardRouter); // this is used to handle dashboard related routes
app.use("/api/v1/healthcheck", healthcheckRouter); // this is used to handle healthcheck related routes
app.use("/api/v1/subscription", subscriptionRouter); // this is used to handle subscription related routes

export {app};