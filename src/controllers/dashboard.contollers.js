import mongoose from "mongoose"
import Video from "../models/video.model.js"
import Subscription from "../models/subscription.model.js"
import Like from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js";
import asynchandeler from "../utils/asynchandler.js";

const getChannelStats = asynchandeler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id;
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }
    const totalVideos = await Video.countDocuments({owner: channelId});
    const totallike= await Like.countDocuments({likedBy: channelId});
    const totalvideoviews= await Video.aggregate([
        { $match: { owner: channelId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalsubscriber = await Subscription.countDocuments({channel: channelId});
    const totalviews = totalvideoviews.length > 0 ? totalvideoviews[0].totalViews : 0;
    return res.status(200).json(
        new Apiresponse(
            200, "Channel stats retrieved successfully", {
                totalVideos,
                totallike,
                totalviews,
                totalsubscriber
            }
        )
    );
})

const getChannelVideos = asynchandeler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user._id;
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }
    const videos = await Video.find({owner: channelId}).sort({createdAt: -1});
    if (!videos || videos.length === 0) {
        return res.status(404).json(new ApiError(404, "No videos found for this channel"));
    }
    return res.status(200).json(
        new Apiresponse(
            200, "Channel videos retrieved successfully", videos
        )
    );
})

export {
    getChannelStats,
    getChannelVideos
    }