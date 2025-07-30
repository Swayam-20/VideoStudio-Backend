import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const commentschema = new Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
},{timestamps:true})

commentschema.plugin(mongooseAggregatePaginate)

const Comment = mongoose.model("Comment",commentschema)
export default {Comment};