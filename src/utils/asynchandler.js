// const asynchandeler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next);
//     }
//     catch(err){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message || "Internal Server Error",
//         });
//     }
//   }


const asynchandeler = (fn) =>{
    return (req,res,next)=>{
        Promise
        .resolve(fn(req, res, next))
        .reject((err) => {
            res.status(err.code || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        });
    }
}

export default asynchandeler;
