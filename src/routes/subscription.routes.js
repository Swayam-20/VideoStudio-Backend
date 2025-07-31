import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT); // Apply JWT verification middleware to all routes
router.route("/:channelId").post(toggleSubscription);
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);
router.route("/subscribed-channels").get(getSubscribedChannels);
export default router;