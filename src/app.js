import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

 const app = express();

app.use(cors(// this is used to enable CORS (Cross-Origin Resource Sharing)
    {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
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

export {app};