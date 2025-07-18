import asynchandeler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadfileoncloudinay from "../utils/cloudinary.js";
import Apiresponse from "../utils/Apiresponse.js";

// method to generate access token and refresh token
    const generateAccessTokenAndRefreshTOKEN = async (userID) => {
        const user = await User.findById(userID)

        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken();

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
        throw new ApiError("All fields are required", 400);
    }

    const existdetail=await User.findOne({
        $or: [{ email },{ username }]
    })
    if(existdetail){
        throw new ApiError("Email or username already exists", 409);
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
    if(!email || !username || !password){
        throw new ApiError("Email and password are required", 400);
    }

    if(!email.includes("@")){
        throw new ApiError("Invalid email format", 400);
    }

    const user= await User.findOne({
        $or: [{ email }, { username: username.toLowerCase() }]
        })//.select("+password +refreshToken +accessToken");

    if(!user){
        throw new ApiError("User not found", 404);
    }

    const isPasswordCorrect = await user.ispasswordcorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError("Incorrect password", 401);
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
        .clearcookie("refreshToken", option) // cookie("refreshToken", null, option)
        .clearcookie("accessToken", option)  // cookie("accessToken", null, option)
        .json(
            new Apiresponse(
                200,
                "User logged out successfully",
                {}
            )
        )
})
export { registeruser, loginuser , loggoutuser };