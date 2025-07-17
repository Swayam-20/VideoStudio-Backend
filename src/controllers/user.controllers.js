import asynchandeler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadfileoncloudinay from "../utils/cloudinary.js";
import Apiresponse from "../utils/Apiresponse.js";

const registeruser = asynchandeler( async (req, res) => {

     // user detail
     // validation or not
     // email or username check unique or already exist
     // check avatar and image
     // upload to cloudinary
     // create user object to save in database
     // remove password and refresh token from response
     // check user creation
     // send response to client
    
    const {email}=req.body;
    console.log(email);

    if(
        [email,passsword,username,fullname].some((field) => 
            !field || field.trim() === ""
        )
    )
    {
        throw new ApiError("All fields are required", 400);
    }

    const existdetail=User.findOne({
        $or: [{ email },{ username }]
    })
    if(existdetail){
        throw new ApiError("Email or username already exists", 409);
    }
    const avatarlocalpath=req.files?.avatar[0]?.path
    const coverImagelocalpath=req.files?.coverImage[0]?.path
    if(!avatarlocalpath || !coverImagelocalpath){
        throw new ApiError("Avatar and cover image are required", 400);
    }
    const avatar=await uploadfileoncloudinay(avatarlocalpath);
    const coverImage=await uploadfileoncloudinay(coverImagelocalpath);
    if(!avatar || !coverImage){
        throw new ApiError("Failed to upload images", 400);
    }

    const user = User.create({
        username : username.tolowerCase(),
        email,

        fullname,
        avatar,
        coverImage,
        password

});
    const createdUser = await User.findbyId(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError("User creation failed", 500);
    }

    return res.status(201).json(
        new Apiresponse(200,"User registered successfully", createdUser)
    );
}
)
export {registeruser};