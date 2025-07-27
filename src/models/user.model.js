import mongoose,{Schema}from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, // this is used to store the avatar cloudinary URL
        required : true
    },
    coverImage: {
        type:String  //    this is used to store the cover image cloudinary URL
    },
    password: {
        type: String,
        required: [true, "Password is required"],
         // this is used to hide the password field when querying the database
    },
    refreshToken:{
        type: String,
        default: null // this is used to store the refresh token for the user
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],

},{
    timestamps: true, // this is used to add createdAt and updatedAt fields to the schema
    
})
userSchema.pre("save", async function (next) {
    // this is used to hash the password before saving it to the database
    if (!this.isModified("password")) return next();
    // const salt = await bcrypt.genSalt(10); // this is used to generate a salt for hashing the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// custom method
userSchema.methods.ispasswordcorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
);
};
userSchema.methods.generateRefreshToken = async function() {
    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
);
};
    const User = mongoose.model("User", userSchema);
    export default User;