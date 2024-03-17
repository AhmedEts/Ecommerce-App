import { Router } from "express";
import uploadFilecloud, { fileValidation } from "../../utils/cloudinaryMulter.js"
import * as productController from './controller/product.controller.js'
import  auth  from "../../middleware/auth.js";
import productEndPoints from "./product.endPoint.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import validation from "../../utils/validation.js";
import * as productValidation from './product.validation.js'

const router=Router()
 
router.post('/createProduct',auth(productEndPoints.create),  
        validation(productValidation.tokenSchema,true),    
        uploadFilecloud(fileValidation.image).fields([
            {name:"mainImage",maxCount:1},
            {name:"subImages",maxCount:5} 
        ]),
        validation(productValidation.createProductSchema),    
        asyncHandler(productController.createProduct))
      .get('/product',productController.getAllProducts)
      .get('/product/:productId',validation(productValidation.getProduct),productController.getOneProduct)
export default router
