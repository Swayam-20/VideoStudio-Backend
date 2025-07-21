import mongoose,{Schema} from "mongoose";

const tweetschema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})



const Tweet = mongoose.model("Tweet",tweetschema)
export default Tweet;