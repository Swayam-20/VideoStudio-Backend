import {Router} from 'express';
import { registeruser } from '../controllers/user.controllers.js';
import upload from '../middlewares/multer.middleware.js'; // Assuming you have a multer setup for file uploads
const router = Router();

router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 }, // Avatar upload
        { name: 'coverImage', maxCount: 1 } // Cover image upload
    ]), // Specify the fields you want to upload, e.g., [{ name: 'avatar' }, { name: 'coverImage' }]

    registeruser);
export default router;
