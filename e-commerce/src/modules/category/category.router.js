import { Router } from "express";
import uploadFilecloud, { fileValidation } from "../../utils/cloudinaryMulter.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import validation from "../../utils/validation.js";
import * as categoryValidation from './category.validation.js'
import * as categoryController from './controller/category.controller.js'
import subCategoryRouterRouter from'../subcategory/subcategory.router.js'
import  auth from "../../middleware/auth.js";
import categoryEndPoints from "./category.endPoint.js";

const router=Router()
router.use('/:categoryId/subCategory',subCategoryRouterRouter)


router.post('/createCategory',

          validation(categoryValidation.tokenSchema,true),
          auth(categoryEndPoints.create),
          uploadFilecloud(fileValidation.image).single('image'),
          validation(categoryValidation.createCategorySchema),
          asyncHandler(categoryController.createCategory))

    .get('/allCategories',
          uploadFilecloud(fileValidation.image).single('image'),
          asyncHandler(categoryController.allCategories))

    .get('/oneCategory/:categoryId', 
         validation(categoryValidation.oneCategorySchema),
         asyncHandler(categoryController.oneCategory))
         
    .put('/updateCategory/:categoryId',
          validation(categoryValidation.tokenSchema,true),
          auth(categoryEndPoints.update),
          uploadFilecloud(fileValidation.image).single('image'),
          validation(categoryValidation.updateCategorySchema),
          asyncHandler(categoryController.updateCategory))
    

 
export default router