export const asyncHandler = (fn) => {
    return (req,res,next) => {
        return fn(req, res,next).catch((error) =>{
            return next (new Error(error,{ cause: 500}))
            // return res.json({ message: error.message, stack: error.stack})
        })
    }
}

export const globalError = (error, req, res, next)=> {
    if(process.env.MOOD== 'DEV'){
        return res.status(error.cause || 500).json({ message: error.message, stack: error.stack})
    }
    return res.status(error.cause || 500).json({ message: error.message})
}