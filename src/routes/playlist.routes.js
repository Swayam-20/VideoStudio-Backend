import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT); // Apply JWT verification middleware to all routes
router.route("/").post(createPlaylist).get(getUserPlaylists);
router.route("/:playlistId")
    .get(getPlaylistById)
    .delete(deletePlaylist)
    .put(updatePlaylist);
router.route("/:playlistId/video").post(addVideoToPlaylist);
router.route("/:playlistId/video/:videoId").delete(removeVideoFromPlaylist);
export default router;