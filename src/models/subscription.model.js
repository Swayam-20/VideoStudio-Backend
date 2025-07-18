import mongoose,{Schema}from "mongoose";



const subscriptonschema=new Schema(
    {
        subscriber:{
            type:Schema.Types.ObjectId,
            ref :"User",
            required:true
        },
        channel :{
            type : Schema.Types.ObjectId,
            ref : "User",
            required:true
        }

},{timestamps:true})
const Subscripton= mongoose.model("Subscription",subscriptonschema)
export default Subscripton