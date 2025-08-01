import mongoose, { isValidObjectId } from "mongoose"
import Tweet from "../models/tweet.model.js"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js"
import asynchandeler from "../utils/asynchandler.js";

const createTweet = asynchandeler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const userId = req.user._id;
    const tweet = await Tweet.create({
        content,
        user: userId
    })
    if (!tweet) {
        throw new ApiError(400, "Failed to create tweet");
    }
    await User.findByIdAndUpdate(userId, {
        $push: {tweets: tweet._id}
    }, {new: true});

    return res.status(201).json(
        new Apiresponse(
            200,"Tweet created successfully",tweet
        )
    )

})

const getUserTweets = asynchandeler(async (req, res) => {
    // TODO: get user tweets
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid user ID");
    }
    const user = await User.findById(id)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const tweets = await Tweet.find({owner:id})
    if (!tweets || tweets.length === 0) {
        return res.status(404).json(new ApiError(404, "No tweets found for this user"));
    }
    return res.status(200).json(
        new Apiresponse(
            200, "User tweets retrieved successfully", tweets
        )
    )

})

const updateTweet = asynchandeler(async (req, res) => {
    //TODO: update tweet
    const {id} = req.params;
    const {content} = req.body;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid tweet ID");
    }
    const tweet = await Tweet.find({id})
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    tweet.content = content;
    await tweet.save();
    return res.status(200).json(
        new Apiresponse(
            200, "Tweet updated successfully", tweet
        )
    )
})

const deleteTweet = asynchandeler(async (req, res) => {
    //TODO: delete tweet
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid tweet ID");
    }
    const tweet = await Tweet.findById(id);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    await tweet.remove();

    const tweets = await Tweet.findByIdAndDelete(id)
    if(!tweets) {
        throw new ApiError(404, "Tweet not found");
    }
    return res.status(200).json(
        new Apiresponse(
            200, "Tweet deleted successfully", null
        )
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}