import { Router } from "express";
import uploadFilecloud, { fileValidation } from "../../utils/cloudinaryMulter.js"
import * as subCategoryController from './controller/subCategory.controller.js'
import * as subCategoryValidation from './subCategory.validation.js'
import { asyncHandler } from "../../utils/asyncHandler.js";
import validation from "../../utils/validation.js";
const router=Router({mergeParams:true})

router.post('/createSubCategory',
                uploadFilecloud(fileValidation.image).single('image'),
                validation(subCategoryValidation.createSubCategorySchema),
                asyncHandler(subCategoryController.createSubCategory))

    .get('/allSubCategories',   
                uploadFilecloud(fileValidation.image).single('image'),
                asyncHandler(subCategoryController.allSubCategories))

    .get('/oneSubCategory/:subCategoryId', 
                uploadFilecloud(fileValidation.image).single('image'),
                validation(subCategoryValidation.oneSubCategorySchema),
                asyncHandler(subCategoryController.oneSubCategory))
         
    .put('/updateSubCategory/:subCategoryId', 
                uploadFilecloud(fileValidation.image).single('image'),
                validation(subCategoryValidation.updateSubCategorySchema),
                asyncHandler(subCategoryController.updateSubCategory))
    
 
 
export default router