import mongoose, {isValidObjectId} from "mongoose"
import Like from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js";
import asynchandeler from "../utils/asynchandler.js";

const toggleVideoLike = asynchandeler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const userId = req.user._id
    const existingLike = await Like.findOne({video: videoId, user: userId})
    if (existingLike) {
        // If like exists, remove it
        await Like.deleteOne({video: videoId, user: userId})
        return res.status(200).json(new Apiresponse(200, "Like removed successfully"))
    } else {
        // If like does not exist, create it
        const newLike = new Like({
            video: videoId,
            user: userId
        })
        await newLike.save()
        return res.status(201).json(new Apiresponse(201, "Like added successfully", newLike))
    }

})

const toggleCommentLike = asynchandeler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const userId = req.user._id
    const existingLike = await Like.findOne({comment: commentId, user: userId})
    if (existingLike) {
        // If like exists, remove it
        await Like.deleteOne({comment: commentId, user: userId})
        return res.status(200).json(new Apiresponse(200, "Like removed successfully"))
    } else {
        // If like does not exist, create it
        const newLike = new Like({
            comment: commentId,
            user: userId
        })
        await newLike.save()
        return res.status(201).json(new Apiresponse(201, "Like added successfully", newLike))
    }


})

const toggleTweetLike = asynchandeler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const userId = req.user._id
    const existingLike = await Like.findOne({tweet: tweetId, user: userId})
    if (existingLike) {
        // If like exists, remove it
        await Like.deleteOne({tweet: tweetId, user: userId})
        return res.status(200).json(new Apiresponse(200, "Like removed successfully"))
    } else {
        // If like does not exist, create it
        const newLike = new Like({
            tweet: tweetId,
            user: userId
        })
        await newLike.save()
        return res.status(201).json(new Apiresponse(201, "Like added successfully", newLike))
    }
}
)

const getLikedVideos = asynchandeler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    const likedVideos = await Like.find({likedBy: userId}).populate('video')
    if (!likedVideos || likedVideos.length === 0) {
        return res.status(404).json(new Apiresponse(404, "No liked videos found"))
    }
    return res.status(200).json(new Apiresponse(200, "Liked videos retrieved successfully", likedVideos))


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}