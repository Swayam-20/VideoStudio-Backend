import asynchandeler from "../utils/asynchandler.js";
import User from "../models/user.model.js";
import uploadfileoncloudinay  from "../utils/cloudinary.js";
import Apiresponse from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";
import Apierror from "../utils/ApiError.js";
// import deletefileoncloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
// method to generate access token and refresh token
const generateAccessTokenAndRefreshTOKEN = async (userID) => {
    const user = await User.findById(userID);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validatebeforeSave: false });

    return { accessToken, refreshToken };
};

const registeruser = asynchandeler(async (req, res) => {
    const { email, password, fullname, username } = req.body;

    if ([email, password, username, fullname].some(field => !field || field.trim() === "")) {
        throw new Apierror("All fields are required", 400);
    }

    const existdetail = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existdetail) {
        throw new Apierror("Email or username already exists", 409);
    }

    const avatarlocalpath = req.files?.avatar?.[0]?.path;

    const coverImagelocalpath = req.files?.coverImage?.[0]?.path;

    if (!avatarlocalpath || !coverImagelocalpath) {
        throw new Apierror("Avatar and cover image are required", 400);
    }

    const avatar = await uploadfileoncloudinay(avatarlocalpath);
    const coverImage = await uploadfileoncloudinay(coverImagelocalpath);

    if (!avatar) {
        throw new Apierror("Failed to upload avatar", 400);
    }

    if (!coverImage) {
        throw new Apierror("Failed to upload cover image", 400);
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || null,
        password
    });
    await user.save({ validatebeforeSave: false });
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTOKEN(user._id);
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new Apierror("User creation failed", 500);
    }
    const options = {
        httpOnly: true,
        secure: true
    };
    
    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new Apiresponse(201, "User registered successfully", createdUser)
    );
});

const loginuser = asynchandeler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new Apierror("Email and username are required", 400);
    }

    if (!email.includes("@")) {
        throw new Apierror("Invalid email format", 400);
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    }).select("+password");

    if (!user) {
        throw new Apierror("User not found", 404);
    }

    const isPasswordCorrect = await user.ispasswordcorrect(password);

    if (!isPasswordCorrect) {
        throw new Apierror("Incorrect password", 401);
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTOKEN(user._id);
    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    const option = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, option)
        .cookie("accessToken", accessToken, option)
        .json(new Apiresponse(200, "User logged in successfully", {
            user: {
                loggedUser,
                accessToken,
                refreshToken
            }
        }));
});

const loggoutuser = asynchandeler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { 
            $unset: { refreshToken: 1 } },
        { new: true }
    );

    const option = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("refreshToken", option)
        .clearCookie("accessToken", option)
        .json(new Apiresponse(200, "User logged out successfully", {}));
});

const RefreshAccessToken = asynchandeler(async (req, res) => {
    const incomingrefreshtoken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingrefreshtoken) {
        throw new Apierror("unauthorized access", 401);
    }

    try {
        const decodedtoken = jwt.verify(incomingrefreshtoken, process.env.REFRESH_TOKEN_SECRET);

        if (!decodedtoken) {
            throw new Apierror("Invalid Refresh Token", 401);
        }

        const user = await User.findById(decodedtoken?._id).select("-password");

        if (incomingrefreshtoken !== user?.refreshToken) {
            throw new Apierror(" Refresh Token not match", 401);
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTOKEN(decodedtoken._id);
        // console.log(refreshToken)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new Apiresponse(200, { accessToken, refreshToken, options }, "Access Token refresh"));
    } catch (error) {
        throw new Apierror(error?.message || "Invalid Refresh token", 401);
    }
});

const changecurrentpassword = asynchandeler(async (req, res) => {
    const { oldpassword, newpassword } = req.body;
    console.log(oldpassword)
    console.log(newpassword)
    const {_id} = req.user
    const user = await User.findById(_id).select("+password")
    console.log(_id)
    if(!user){
        throw new Apierror("user not found",401)
    }
    const passwordcorrect = await user.ispasswordcorrect(oldpassword);

    if (!passwordcorrect) {
        throw new Apierror("wrong input old password", 401);
    }
    console.log("************")

    
        user.password = newpassword;
        await user.save({ validatebeforeSave: false });
        
    
    return res
    .status(200)
    .json(new Apiresponse(200, "password change successfully", {}));

});

const getcurrentuser = asynchandeler(async (req, res) => {
    // If req.user contains a Mongoose document or a raw MongoDB object,
    //  it may have internal references that cause this error.
    const { _id , username , fullname }=req.user
    console.log(username)
    return res.status(200).json(new Apiresponse(200, "Current user", { _id , username , fullname }));
});

const updateUserDetail = asynchandeler(async (req, res) => {
    const { email, fullname } = req.body;

    if (!email || !fullname) {
        throw new Apierror("Required All fields", 401);
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { fullname, email } },
        { new: true }
    ).select("-password");
    
    return res.status(200).json(new Apiresponse(200, "Detail Update successfully", {fullname,email} ));
});

const updateUserAvatar = asynchandeler(async (req, res) => {
    const avatarlocalpath = req.file?.path;

    if (!avatarlocalpath) {
        throw new Apierror("invalid path", 401);
    }
    
    const avatar = await uploadfileoncloudinay(avatarlocalpath);
    if (!avatar.url) {
        throw new Apierror("file not uploaded", 500);
    }

    // const deleteoldavatar = await deletefileoncloudinary(req.user?.avatar.url);
    // if (!deleteoldavatar) {
    //     throw new Apierror("failed to delete old avatar", 501);
    // }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-passowrd");

    return res.status(200).json(new Apiresponse(200, "Avatar updated successfully", user));
});

const updateUserCoverImage = asynchandeler(async (req, res) => {
    const coverImagelocalpath = req.file?.path;

    if (!coverImagelocalpath) {
        throw new Apierror("invalid path", 401);
    }

    const coverImage = await uploadfileoncloudinay(coverImagelocalpath);
    if (!coverImage.url) {
        throw new Apierror("file not uploaded", 500);
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
    ).select("-password");

    return res.status(200).json(new Apiresponse(200, "cover Image updated successfully", user));
});

const getUserChannelprofile = asynchandeler(async (req, res) => {
    const { username } = req.params;
    // console.log(username)
    if (!username.trim() ==="") {
        throw new Apierror("not valid a user", 400);
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                channelsubscribers: { $size: "$subscribers" },
                channelsubscribedTo: { $size: "$subscribedTo" },
                issubscribe: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
                issubscribe: 1,
                channelsubscribedTo: 1,
                channelsubscribers: 1,
                email: 1,
                coverImage: 1
            }
        }
    ]);
    // console.log(channel.length)
    if (!channel.length) {
        throw new Apierror("channel doesn't exist", 400);
    }

    return res.status(200).json(new Apiresponse(200, channel[0], "User channel"));
});

const getwatchHistory = asynchandeler(async (req, res) => {
    const {_id} = req.user
    // console.log(_id)
    const user = await User.aggregate([
        {
            $match: {
                
                _id:_id
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            
                            pipeline: [
                                {
                                    $addFields: {
                                        owner: { $first: "$owner" }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                watchHistory_count:{
                    $size:"$watchHistory"
                }
            }
        },
        {
            $project: {
                watchHistory: 1,
                watchHistory_count:1
            }
        }
    ]);
    // console.log(user)
    if (!user.length) {
        throw new Apierror("user not found", 404);
    }

    return res.status(200).json(new Apiresponse(200, "successfully fetch Watch History", user[0] ));
});

export {
    RefreshAccessToken,
    registeruser,
    loginuser,
    loggoutuser,
    changecurrentpassword,
    getcurrentuser,
    updateUserDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelprofile,
    getwatchHistory
};
