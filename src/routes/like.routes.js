import { Router } from "express";
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT); // Apply JWT verification middleware to all routes

router.route("/video/:videoId").post(toggleVideoLike);
router.route("/comment/:commentId").post(toggleCommentLike);
router.route("/tweet/:tweetId").post(toggleTweetLike);
router.route("/liked-videos").get(getLikedVideos);
export default router;
