import mongoose, {isValidObjectId} from "mongoose"
import asynchandeler from "../utils/asynchandler.js"
import User from "../models/user.model.js"
import Video from "../models/video.model.js"
import Apierror from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js"
import uploadfileoncloudinay  from "../utils/cloudinary.js"


const getAllVideos = asynchandeler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {
            [sortBy || 'createdAt']: sortType === 'desc' ? -1 : 1
        }
    }
    const getVideos = await Video.paginate(
        {
            ...(query && { title: { $regex: query, $options: 'i' } }),
            ...(userId && { owner: mongoose.Types.ObjectId(userId) })
        },
        options
    )
    if (!getVideos || getVideos.length === 0) {
        return res.status(404).json(new Apierror(404, "No videos found"));
    }
    return res.status(200).json(
        new Apiresponse(
            200, "Videos retrieved successfully", getVideos
        )
    )
})

const publishAVideo = asynchandeler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    const { video } = req.files
    if (!video) {
        throw new Apierror(400, "Video file is required");
    }
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new Apierror(400, "Invalid user ID");
    }
    const videofilepath= await req.files.videoFile[0].path
    if (!videofilepath) {
        throw new Apierror(400, "Video file path is required");
    }
    if (!title || !description) {
        throw new Apierror(400, "Title and description are required");
    }
    // const thumbnail = req.files.thumbnail[0].path
    const videoUrl = await uploadfileoncloudinay(videofilepath, "videos")
    const thumbnailUrl = await uploadfileoncloudinay(video.tempFilePath, "thumbnails")

    const newVideo = await Video.create({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        owner: userId,
        isPublished: true
    })
    if (!newVideo) {
        throw new Apierror(400, "Failed to create video");
    }
    await newVideo.save()
    return res.status(201).json(
        new Apiresponse(
            210, newVideo, "Video published successfully"
        )
    )
})

const getVideoById = asynchandeler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video ID");
    }
    const video = await Video.findById(videoId).populate("owner", "username avatar")
    if (!video) {
        throw new Apierror(404, "Video not found");
    }
    return res.status(200).json(
        new Apiresponse(
            200, video, "Video retrieved successfully"
        )
    )
})

const updateVideo = asynchandeler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body
    if (!isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video ID");
    }
    if (!title || !description) {
        throw new Apierror(400, "Title and description are required");
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new Apierror(404, "Video not found");
    }
    const thumbnail = req.files?.thumbnail[0].path;
    if (thumbnail) {
        video.thumbnailUrl = await uploadfileoncloudinay(thumbnail, "thumbnails")
    }
    video.title = title
    video.description = description
    await video.save()
    return res.status(200).json(
        new Apiresponse(
            200, video, "Video updated successfully"
        )
    )

})

const deleteVideo = asynchandeler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video ID");
    }
    const videodeleted=await Video.findByIdAndDelete(videoId)
    if (!videodeleted) {
        throw new Apierror(404, "Video not found");
    }
    return res.status(200).json(
        new Apiresponse(
            200, null, "Video deleted successfully"
        )
    )
})

const togglePublishStatus = asynchandeler(async (req, res) => {
    const { videoId } = req.params

    const userId = req.user._id
    if(!isValidObjectId(videoId)){
        throw new Apierror(400, "Invalid video ID");
    }
    const videocheck = await Video.findOne({ _id: videoId, owner: userId })
    if (videocheck) {
        // If video exists, remove it
        await Video.deleteOne({_id: videoId, owner: userId})
        return res.status(200).json(new Apiresponse(200, "video removed successfully"))
    } else {
        // If video does not exist, create it
        const video = new Video({
            _id: videoId,
            owner: userId,
            title: req.body.title || "Untitled Video",
            description: req.body.description || "No description",
            videoUrl: req.files.videoFile ? await uploadfileoncloudinay(req.files.videoFile[0].path, "videos") : null,
            thumbnailUrl: req.files.thumbnail ? await uploadfileoncloudinay(req.files.thumbnail[0].path, "thumbnails") : null,
            isPublished: true
        })
        await video.save()
        return res.status(201).json(new Apiresponse(201, "video added successfully", video))
    }
})

export default {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
