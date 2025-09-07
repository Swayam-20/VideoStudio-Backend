import ApiError from "../utils/ApiError.js"
import Apiresponse from "../utils/Apiresponse.js";
import asynchandeler from "../utils/asynchandler.js";


const healthcheck = asynchandeler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res.status(200).json(
        new Apiresponse(
            200, "OK", {status: "OK"}
        )
    )
})

export default healthcheck
    
    