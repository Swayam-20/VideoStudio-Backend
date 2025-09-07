import mongoose, {isValidObjectId} from "mongoose"
import Playlist from "../models/playlist.model.js"
import ApiError from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js";
import asynchandeler from "../utils/asynchandler.js";


const createPlaylist = asynchandeler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Playlist name is required")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: userId
    })
    return res.status(201).json(
        new Apiresponse(201, "Playlist created successfully", playlist)
    )

})

const getUserPlaylists = asynchandeler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const playlists = await Playlist.find({owner: userId})
    if (!playlists || playlists.length === 0) {
        return res.status(404).json(new Apiresponse(404, "No playlists found"))
    }
    return res.status(200).json(
        new Apiresponse(200, "Playlists fetched successfully", playlists)
    )
})

const getPlaylistById = asynchandeler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId )){
        throw new ApiError(
            400,"Invalid playlist Id"
        )
    }
    const playlist= await Playlist.findbyId(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(
        new Apiresponse(200, "Playlist fetched successfully", playlist)
    )
})

const addVideoToPlaylist = asynchandeler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // add video to playlist
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const videoExists = playlist.videos.includes(videoId)
    if(videoExists) {
        throw new ApiError(400, "Video already exists in the playlist")
    }
    await playlist.updateOne({
        // this will add the videoId to the videos array in the playlist
        $push: {
            videos: videoId
        }
    })
    return res.status(200).json(
        new Apiresponse(200, "Video added to playlist successfully", playlist)
    )
})

const removeVideoFromPlaylist = asynchandeler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const videoExists = playlist.videos.includes(videoId)
    if(!videoExists) {
        throw new ApiError(400, "Video not exists in the playlist")
    }
    await playlist.updateOne({
        // this will remove the videoId from the videos array in the playlist
        $pull: {
            videos: videoId
        }
    })
    return res.status(200).json(
        new Apiresponse(200, "Video remove from playlist successfully", playlist)
    )

})

const deletePlaylist = asynchandeler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const playlist = await Playlist.findById(playlistId)
    await playlist.deleteOne()
    return res.status(200).json(
        new Apiresponse(200, "Playlist deleted successfully")
    )
})

const updatePlaylist = asynchandeler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if(name && name.trim() !== "") {
        playlist.name = name
    }
    if(description && description.trim() !== "") {
        playlist.description = description
    }
    await playlist.save({validateBeforeSave: false})
    return res.status(200).json(
        new Apiresponse(200, "Playlist updated successfully", playlist)
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}