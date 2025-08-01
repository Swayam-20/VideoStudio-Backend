import { Router } from "express";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}from "../controllers/tweet.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/create").post(createTweet);
router.route("/user/:id").get(getUserTweets);
router.route("/update/:id").put(updateTweet);
router.route("/delete/:id").delete(deleteTweet);

export default router;