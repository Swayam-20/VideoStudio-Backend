import mongoose from "mongoose"
import Comment from "../models/comment.model.js"
import ApiError from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js";
import asynchandeler from "../utils/asynchandler.js";
import Video from "../models/video.model.js"
const getVideoComments = asynchandeler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 10, limit = 10} = req.query
    
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    
    const commentaggregation = Comment.aggregate([
        {
            $match: {
                video: video._id
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                    $project: {
                        username: 1,
                        avatar: 1
                    }
                }
            ]

            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"comment",
                as:"likes"

            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                isLiked:{
                $cond: {
                    if: {  $in: [req.user._id, "$likes.likedBy"] },
                    then: true,
                    else: false
                }
            },
            owner:{
                $first: "$owner"
            }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project:{
                content:1,
                createdAt:1,
                likesCount:1,
                isLiked:1,
                owner:1
            }
        }
    ])

    const comments = await Comment.aggregatePaginate(commentaggregation, {
        page: parseInt(page),
        limit: parseInt(limit)
    })

    return res.status(200).json(
        new Apiresponse(200, "Comments fetched successfully", comments)
    )
})

const addComment = asynchandeler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    const comment = await Comment.create({
        content,
        owner: req.user._id,
        video: video._id
    })

    await video.updateOne({
        $push: {
            comments: comment._id
        }
    })
    return res.status(201).json(
        new Apiresponse(201, "Comment added successfully", comment)
    )


})

    // update comment 
const updateComment = asynchandeler(async (req, res) => {
    
    const {videoId, commentId} = req.params
    const {content} = req.body
    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required")
    }
    if(videoId.length!=24 || !mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }
    if(commentId.length!=24 || !mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    const comment = await Comment.findOne({
        _id: commentId,
        owner: req.user._id,
        video: video._id
    })
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    // update the comment content
    comment.content = content
    await comment.save({validatebeforeSave: false})

    return res.status(200).json(
        new Apiresponse(200, "Comment updated successfully", comment)
    )

})

const deleteComment = asynchandeler(async (req, res) => {
    // TODO: delete a comment
    const {videoId, commentId} = req.params
    if(videoId.length!=24 || !mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }
    
    if(commentId.length!=24 || !mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    const comment = await Comment.findOne({
        _id: commentId,
        owner: req.user._id,
        video: video._id
    })
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    await comment.deleteOne()
    await video.updateOne({
        $pull: {
            comments: comment._id
        }
    })
    return res.status(200).json(
        new Apiresponse(200, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
    }