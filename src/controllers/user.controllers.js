import asynchandeler from "../utils/asynchandler.js";


const registeruser = asynchandeler(async (req, res) => {
     res.status(200).json({
        success:true,
        message:"ok"
    })
});

export {registeruser};