import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({

    videofile:{
        type: String, //Cloudnary URL of the video file
        required: true,
    },
    thumbnail:{
        type: String, // URL of the thumbnail image
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    description:{
        type: String,
        trim: true,
    },
    views:{
        type: Number,
        default: 0, // Default view count is 0
    },
    isPublished:{
        type: Boolean,
        default: true, // Default is published
    },
    duration:{
        type: Number, // Duration of the video in seconds
        required: true,
    }

},{timestamps: true}); // Automatically add createdAt and updatedAt fields

videoSchema.plugin(mongooseAggregatePaginate); // Plugin for pagination
export const Video = mongoose.model('Video', videoSchema);