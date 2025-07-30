import {Router} from 'express';
import {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    } from '../controllers/comment.controllers.js';
import {upload} from '../middlewares/multer.middleware.js'; // Assuming you have a multer setup for file uploads

import verifyJWT from '../middlewares/auth.middleware.js';
const router = Router();

router.use(verifyJWT); // Apply JWT verification middleware to all routes
router.route("/video/:videoId").get(getVideoComments)
export default router;
