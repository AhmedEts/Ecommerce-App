import { Router } from "express";
import uploadFilecloud, { fileValidation } from "../../utils/cloudinaryMulter.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import validation from "../../utils/validation.js";
import * as brandValidation from './brand.validation.js'
import * as brandController from './controller/brand.controller.js'
 
const router=Router()


router.post('/createBrand',
          uploadFilecloud(fileValidation.image).single('image'),
          validation(brandValidation.createBrandSchema),
          asyncHandler(brandController.createBrand))

    .get('/allBrands',
          uploadFilecloud(fileValidation.image).single('image'),
          asyncHandler(brandController.allBrands))

    .get('/oneBrand/:brandId', 
         validation(brandValidation.oneBrandSchema),
         asyncHandler(brandController.onebrand))
         
    .put('/updateBrand/:brandId',
          uploadFilecloud(fileValidation.image).single('image'),
          validation(brandValidation.updateBrandSchema),
          asyncHandler(brandController.updateBrand))
    

 
export default router