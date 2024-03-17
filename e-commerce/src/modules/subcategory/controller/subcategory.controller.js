import slugify from "slugify";
import categoryModel from "../../../DB/models/Category.model.js";
import subCategoryModel from "../../../DB/models/SubCategory.model.js";
import brandModel from "../../../DB/models/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/asyncHandler.js";


// 1- find if name of category exit
// 2- upload image 
// 3- make slug of name 
// 4- add category 
export const createSubCategory =  
    async(req , res , next ) => {
        const { categoryId } = req.params
        if(await categoryModel.findById( { _id: categoryId } )) {
            return next (new Error("category not found",{ cause: 404}))
        }
    const { name } = req.body;
    if (await subCategoryModel.findOne( { name } )) {
        // return res.status(409).json( { message: "name already exist " })
        return next (new Error("name already exist",{ cause: 409}))
    }
    const { public_id, secure_url}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/catagory/${categoryId}/subCategory`})
    if(!public_id) {
        return res.status(400).json( { message: "image is required" })
    }
    req.body.image= {public_id,secure_url}
    req.body.slug= slugify(name)
    req.body.categoryId= categoryId
    const newSubCategory= await subCategoryModel.create(req.body)
    return res.status(201).json ({ message: "done", subCategory: newSubCategory})
}


export const allSubCategories=  
    async (req,res,next) => {
        const{categoryId}= req.params
        const SubCategories = await subCategoryModel.find({categoryId})
        return res.status(200).json({ message: "Done", SubCategories})
    }


export const oneSubCategory= 
    async (req,res,next) => {
        const SubCategories = await subCategoryModel.findById({_id: req.params.SubCategoriesId})
        return res.status(200).json({ message: "Done", SubCategories})
    
    }


export const updateSubCategory = 
    async(req , res , next ) => {
        const { SubCategoryId }= req.params
        const catagory= await subCategoryModel.findById( { _id: SubCategoryId } )
        if (! SubCategory) {
        // return res.status(404).json( { message: "category not found " })
        return next (new Error("SubCategory not found ",{ cause: 404}))

    }

        if(req.body.name){
            if ( await subCategoryModel.findOne( { name : req.body.name } )) {
            // return res.status(409).json( { message: "name already exist " })
            return next (new Error("name already exist ",{ cause: 409}))

        }
            req.body.slug = slugify(req.body.name)
    }

        if(req.file){
            const { public_id, secure_url}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/catagory/${req.params.categoryId}/subCategory`})
        if(!public_id) {
        // return res.status(400).json( { message: "image is required" })
            return next (new Error("image is required ",{ cause: 400}))
    }
        req.body.image = { public_id, secure_url}
        await cloudinary.uploader.destroy(SubCategory.image.public_id)
        }
    
        const updateSubCategory= await subCategoryModel.findOneAndUpdate({_id: SubCategoryId}, req.body, { new: true})
        return res.status(201).json ({ message: "done", category: updateSubCategory})
    }


export const deleteCategory =  
    async (req, res, next) => {
        const { categoryId } = req.params

    // 1- delete category
        const catgory = await subCategoryModel.findByIdAndDelete(categoryId)
        if (!catgory) return next({ cause: 404, message: 'Category not found' })

    // 2-delete the related subcategories
        const subCategories = await subCategoryModel.deleteMany({ categoryId })
        if (subCategories.deletedCount <= 0) {
            console.log(subCategories.deletedCount);
            console.log('There is no related subcategories');
        }

    //3- delete the related brands
        const brands = await brandModel.deleteMany({ categoryId })
        if (brands.deletedCount <= 0) {
            console.log(brands.deletedCount);
            }


    // 4- delete the category folder from cloudinary
        await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/Categories/${catgory.folderId}`)
        await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER}/Categories/${catgory.folderId}`)

        res.status(200).json({ success: true, message: 'SubCategory deleted successfully' })
    }
