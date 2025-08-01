import { Router } from "express";
import  {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/upload.middleware.js";

const router = Router();
router.use(verifyJWT);
router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );




router.route("/publish").post(publishAVideo);
router.route("/:videoId").get(getVideoById);
router.route("/:videoId").put(updateVideo);
router.route("/:videoId").delete(deleteVideo);
router.route("/:videoId/toggle-publish").put(togglePublishStatus);
export default router;