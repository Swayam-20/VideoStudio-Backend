import {Router} from 'express';
import { RefreshAccessToken,
    registeruser,
    loginuser ,
    loggoutuser ,
    changecurrentpassword ,
    getcurrentuser,
    updateUserDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelprofile,
    getwatchHistory } from '../controllers/user.controllers.js';
import {upload} from '../middlewares/multer.middleware.js'; // Assuming you have a multer setup for file uploads

import verifyJWT from '../middlewares/auth.middleware.js';
const router = Router();

router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 }, // Avatar upload
        { name: 'coverImage', maxCount: 1 } // Cover image upload
    ]), // Specify the fields you want to upload, e.g., [{ name: 'avatar' }, { name: 'coverImage' }]

    registeruser);

router.route("/login").post(loginuser);
router.route("/logout").post(verifyJWT,loggoutuser);
router.route("/refreshAccessToken").post(RefreshAccessToken)
router.route("/change-password").post(verifyJWT,changecurrentpassword)
router.route("/current-user").get(verifyJWT,getcurrentuser)
router.route("/update-user-detail").patch(verifyJWT,updateUserDetail)
router.route("/update-user-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-user-cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelprofile)
router.route("/watch-histroy").get(verifyJWT,getwatchHistory)
export default router;
