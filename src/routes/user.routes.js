import {Router} from 'express';
import { loggoutuser, loginuser, RefreshAccessToken, registeruser } from '../controllers/user.controllers.js';
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
router.route("/refreshAccessToken").get(RefreshAccessToken)
export default router;
