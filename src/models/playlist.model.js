import mongoose,{Schema} from "mongoose";

const playlistschema = new Schema({
   name:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
   },
   owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
   },
   video:[{
    type:Schema.Types.ObjectId,
    ref:"Video"
   }]
},{timestamps:true})


const Playlist = mongoose.model("Playlist",playlistschema)
export default Playlist;