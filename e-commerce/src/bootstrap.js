import userRouter from './modules/user/user.router.js'
import authRouter from './modules/auth/auth.router.js'
import categoryRouter from './modules/category/category.router.js'
import subcategoryRouter from './modules/subcategory/subcategory.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import brandRouter from './modules/brand/brand.routes.js'
import productRouter from './modules/product/product.router.js'
import connection from './DB/connection.js'
import { globalError } from './utils/asyncHandler.js'


const bootstrap = ( app, express) => {
    connection()
    app.use(express.json())
    app.use('/uploads', express.static('uploads'))
    app.use('/user', userRouter)
    app.use('/auth', authRouter)
    app.use('/category',categoryRouter)
    app.use('/subcategory',subcategoryRouter)
    app.use('/coupon', couponRouter )
    app.use('/brand' , brandRouter) 
    app.use('/product', productRouter)
    
    app.use('*',(req,res,next)=>{
        return res.json({message:'invaild request'})
    })
    app.use ((error, req , res , next )=> {
        return res.json ({message: error.message, stack: error.stack})
    })

    //FAILER ERROR
    app.use(globalError)
}

export default bootstrap