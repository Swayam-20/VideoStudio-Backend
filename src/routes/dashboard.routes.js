import { Router } from "express";
import {
    getChannelStats, getChannelVideos
    }
from "../controllers/dashboard.controllers.js";
const router = Router();

import verifyJWT from "../middlewares/auth.middleware.js";
router.use(verifyJWT);
router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router;