import mongoose, {isValidObjectId} from "mongoose"
import User from "../models/user.model.js"
import  Subscription  from "../models/subscription.model.js"
import ApiError from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js";
import asynchandeler from "../utils/asynchandler.js";


const toggleSubscription = asynchandeler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError(
            400,
            "Inavlid channel Id"
        )
    }
    const userId = req.user._id
    const existingSubscription = await Subscription.findOne({channel: channelId, subscriber: userId})
    if(existingSubscription){
        await Subscription.deleteOne({
            channel:channelId,
            subscriber:userId
        })
        return res.status(200).json(
            new Apiresponse(
                200,
                "Unsubscribed successfully"
            )
        )
    }
    else {
        const newsubscription = new Subscription.create({
            channel : channelId,
            subscriber:userId
        })
        await newsubscription.save()
        return res.status(201).json(
            new Apiresponse(
                201,
                "subscribed successfully",
                newsubscription
            )
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandeler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(
            400,
            "Invalid channel Id"
        )
    }
    const subscribers = await Subscription.find({channel: channelId})
    if(!subscribers || subscribers.length === 0){
        return res.status(404).json(
            new Apiresponse(
                404,
                "No subscribers found for this channel"
            )
        )
    }
    const subscriberIds = subscribers.map(sub => sub.subscriber)
    const users = await User.find({_id: {$in: subscriberIds}})
    if(!users || users.length === 0){
        return res.status(404).json(
            new Apiresponse(
                404,
                "No subscribers found for this channel"
            )
        )
    }
    console.log(users)
    return res.status(200).json(
        new Apiresponse(
            200,
            "Subscribers fetched successfully",
            users
        )
    )
    
    
})
// getUserChannelSubscribers()
// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandeler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(
            400,
            "Invalid channel Id"
        )
    }

    const channels = await Subscription.find({subscriber: subscriberId})
    if(!channels || channels.length === 0){
        return res.status(404).json(
            new Apiresponse(
                404,
                "No channels found for this subscriber"
            )
        )
    }

    const channelIds = channels.map(sub => sub.channel)
    const users = await User.find({_id: {$in: channelIds}})
    if(!users || users.length === 0){
        return res.status(404).json(
            new Apiresponse(
                404,
                "No channels found for this subscriber"
            )
        )
    }
    
    // console.log(users)
    return res.status(200).json(
        new Apiresponse(
            200,
            "channels fetched successfully",
            users
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}