import asynchandeler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js";
import uploadfileoncloudinay from "../utils/cloudinary.js";
import Apiresponse from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";
import Apierror from "../utils/ApiError.js";
// method to generate access token and refresh token
    const generateAccessTokenAndRefreshTOKEN = async (userID) => {
        const user = await User.findById(userID)

        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken();

        user.refreshToken= refreshToken;

        await user.save({validatebeforeSave: false});
        return { accessToken, refreshToken };
    }


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
    
    const {email,password,fullname,username}=req.body;
    
    // console.log(email);

    if(
        [email,password,username,fullname].some((field) => 
            !field || field.trim() === ""
        )
    )
    {
        throw new Apierror("All fields are required", 400);
    }

    const existdetail=await User.findOne({
        $or: [{ email },{ username }]
    })
    if(existdetail){
        throw new Apierror("Email or username already exists", 409);
    }
    const avatarlocalpath=req.files?.avatar[0]?.path;

    // const coverImagelocalpath=req.files?.coverImage[0]?.path;

    // new method
    let coverImagelocalpath;
    if
    (req.files?.coverImage && req.files.coverImage.length > 0) {
        coverImagelocalpath = req.files.coverImage[0].path;
    }
    if(!avatarlocalpath || !coverImagelocalpath){
        throw new ApiError("Avatar and cover image are required", 400);
    }
    const avatar=await uploadfileoncloudinay(avatarlocalpath);

    const coverImage=await uploadfileoncloudinay(coverImagelocalpath);

    // check if avatar and cover image are uploaded successfully
    if(!avatar ){
        throw new ApiError("Failed to upload avatar", 400);
    }
    if(!coverImage){
        throw new ApiError("Failed to upload cover image", 400);
    }

    const user = await User.create({
        username : username.toLowerCase(),
        email,

        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || null, // coverImage is optional,
        password
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError("User creation failed", 500);
    }

    return res.status(201).json(
        new Apiresponse(200,"User registered successfully", createdUser)
    );
}
)

const loginuser = asynchandeler(async (req, res) => {
    // user detail input
    // check user account is registered or not
    // validation or not
    // send to client refresh token and access token
    // session time
    // save session time in database
    // send response to client that user is logged in successfully
    

    const {email,username, password} = req.body;
    if(!email && !username){
        throw new Apierror("Email and username are required", 400);
    }

    if(!email.includes("@")){
        throw new Apierror("Invalid email format", 400);
    }

    const user= await User.findOne({
        $or: [{ email }, { username }]
        }).select("+password ");

    if(!user){
        throw new Apierror("User not found", 404);
    }

    const isPasswordCorrect = await user.ispasswordcorrect(password);

    if(!isPasswordCorrect){
        throw new Apierror("Incorrect password", 401);
    }
    // generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTOKEN(user._id);
    const loggedUser = await User.findById(user._id).select("-password -refreshToken");
    const option ={
        httpOnly:true,
        secure : true
    }
    return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
        new Apiresponse(
            200,
            "User logged in successfully",
            {
                user : {
                    loggedUser,
                    accessToken,refreshToken
                }
            }
        )
    )



})

const loggoutuser = asynchandeler(async (req,res) =>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        })
        const option ={
        httpOnly:true,
        secure : true
    }
    
    return res
        .status(200)
        .clearCookie("refreshToken", option) // cookie("refreshToken", null, option)
        .clearCookie("accessToken", option)  // cookie("accessToken", null, option)
        .json(
            new Apiresponse(
                200,
                "User logged out successfully",
                {}
            )
        )
})

const RefreshAccessToken = asynchandeler(async (req,res)=>{

        const incomingrefreshtoken=req.cookies?.refreshToken || req.body.refreshToken;

        if(!incomingrefreshtoken){
            throw new ApiError(
                "unauthorized access" , 401
            )
        }

        try {
            
            const decodedtoken=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)

            if(!decodedtoken){
                throw new ApiError(
                    "Invalid Refresh Token" , 401
                )
            }
            const user = User.findById(decodedtoken?._id).select("-password")

            if(incomingrefreshtoken !== user.refreshToken){
                throw new Apierror(
                    error.message , 401
                )
            }
            const options = {
                httpOnly:true,
                secure:true
            }
            const {accessToken , newrefreshtoken} = await generateAccessTokenAndRefreshTOKEN(decodedtoken._id)

            return res
            .status(200)
            .cookie("accessToken" , accessToken ,options )
            .cookie("refreshToken",newrefreshtoken,options)
            .json(
                new Apiresponse(
                    200,
                    {accessToken,refreshToken:newrefreshtoken,options},
                    "Access Token refresh"
                )
            )


        } catch (error) {
            throw new ApiError(
                error?.message ||"Invalid Refresh token", 401
            )
        }
})

const changecurrentpassword = asynchandeler(async (req,res)=>{
    const {oldpassword,newpassword}=req.body
    
    const user = await User.findById(req.user?._id).select("+password")
    const ispasswordcorrect = await user.ispasswordcorrect(oldpassword)

    if(!ispasswordcorrect){
        throw new Apierror(
            "wrong input old password",401 ,error
        )
    }
    try {
        user.password=newpassword
    
    
        user.save({validatebeforeSave:false})
        return res
        .status(200)
        .json(
            new Apiresponse(
                201,{},"password change succesfully"
            )
        )
    } catch (error) {
        throw new Apierror(
            "Invalid entry ",401,error
        )
    }
})

const getcurrentuser = asynchandeler(async(req,res)=>{
    return res.status(200).json(
        new Apiresponse(
            201,req.user,"Current user"
        )
    )
})

const updateUserDetail = asynchandeler( async(req,res)=>{
    const {email, fullname} = req.body

    if(!email || !fullname){
        throw new Apierror(
            "Required All fields",401
        )
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{fullname,email}
        },
        {
            new:true
        }
    ).select("-password")


    return res.status(200).json(
        new Apiresponse(
            201,
            {user},
            "Detail Update successfully",

        )
    )
})

const updateUserAvatar = asynchandeler (async (req,res)=>{

    const avatarlocalpath= req.file?.path
    if(!avatarlocalpath){
        throw new Apierror(
            "invalid path",401
        
        )
    }
    const avatar = await uploadfileoncloudinay(avatarlocalpath)
    if(!avatar.url){
        throw new Apierror(
            "file not uploaded",500
        )
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar:avatar.url
            }
        },
        {
            new:true
        }
    )
    return res.status(200).json(
        new Apiresponse(
            201,
            user,
            "Avatar updated successfully"
        )
    )
})

const updateUserCoverImage = asynchandeler (async (req,res)=>{

    const coverImagelocalpath= req.file?.path
    if(!coverImagelocalpath){
        throw new Apierror(
            "invalid path",401
        
        )
    }
    const coverImage = await uploadfileoncloudinay(coverImagelocalpath)
    if(!coverImage.url){
        throw new Apierror(
            "file not uploaded",500
        )
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage:coverImage.url
            }
        },
        {
            new:true
        }
    )
    return res.status(200).json(
        new Apiresponse(
            201,
            user,
            "Avatar updated successfully"
        )
    )
})
export { 
    RefreshAccessToken,
    registeruser,
    loginuser ,
    loggoutuser ,
    changecurrentpassword ,
    getcurrentuser,
    updateUserDetail,
    updateUserAvatar,
    updateUserCoverImage
};