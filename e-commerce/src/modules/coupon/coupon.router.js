import { Router } from "express";
import uploadFilecloud, { fileValidation } from "../../utils/cloudinaryMulter.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import validation from "../../utils/validation.js";
import * as couponValidation from './coupon.validation.js'
import * as couponController from './controller/coupon.controller.js'
 
const router=Router()


router.post('/createCoupon',
          uploadFilecloud(fileValidation.image).single('image'),
          validation(couponValidation.createCouponSchema),
          asyncHandler(couponController.createCoupon))

    .get('/allCoupons',
          uploadFilecloud(fileValidation.image).single('image'),
          asyncHandler(couponController.allCoupons))

    .get('/oneCoupon/:couponId', 
         validation(couponValidation.oneCouponSchema),
         asyncHandler(couponController.oneCoupon))
         
    .put('/updateCoupon/:couponId',
          uploadFilecloud(fileValidation.image).single('image'),
          validation(couponValidation.updateCouponSchema),
          asyncHandler(couponController.updateCoupon))
    

 
export default router