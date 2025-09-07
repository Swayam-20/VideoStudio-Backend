import { Router } from "express";
import {  GetAllVideos,
    PublishAVideo,
    GetVideoById,
    UpdateVideo,
    DeleteVideo,
    TogglePublishStatus
} from "../controllers/video.controllers.js";


import verifyJWT from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // this is used to protect all the routes below this line
router
    .route("/")
    .get(GetAllVideos)
    .post(
        upload.fields([
            {
                name: "videofile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        PublishAVideo
    );




router.route("/:videoId").get(GetVideoById).patch(upload.single("thumbnail"), UpdateVideo).delete(DeleteVideo);
router.route("/:videoId/toggle-publish").put(TogglePublishStatus);
export default router;