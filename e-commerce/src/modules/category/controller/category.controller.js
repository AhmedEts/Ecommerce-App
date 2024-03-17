import slugify from "slugify";
import categoryModel from "../../../DB/models/Category.model.js";
import brandModel from "../../../DB/models/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/asyncHandler.js";


// 1- find if name of category exit
// 2- upload image 
// 3- make slug of name 
// 4- add category 
export const createCategory =  
    async(req , res , next ) => {
    const { name } = req.body;
    if (await categoryModel.findOne( { name } )) {
        // return res.status(409).json( { message: "name already exist " })
        return next (new Error("name already exist",{ cause: 409}))
    }
    if(!req?.file){
        return next(new Error("image required"))
      }
      
    const { public_id, secure_url}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/category`})
    if(!public_id) {
        return res.status(400).json( { message: "image is required" })
    }
    req.body.image= {public_id,secure_url}
    req.body.updatedBy=req.user._id
    req.body.createdBy=req.user._id
    req.body.slug= slugify(name)
    const newCategory= await categoryModel.create(req.body)
    return res.status(201).json ({ message: "done", category: newCategory})
}


export const allCategories=  
    async (req,res,next) => {
    const categories = await categoryModel.find()
    // return res.status(200).json({ message: "Done", categories})
    return next (new Error("Done",{ cause: 200}))
}


export const oneCategory= 
    async (req,res,next) => {
    const category = await categoryModel.findById({_id: req.params.categoryId})
    return res.status(200).json({ message: "Done", category})
    
}


export const updateCategory =  
    async(req , res , next ) => {
    const { categoryId }= req.params
    const catagory= await categoryModel.findById( { _id: categoryId } )
    if (! catagory) {
        // return res.status(404).json( { message: "category not found " })
        return next (new Error("category not found ",{ cause: 404}))

    }

    if(req.body.name){
        if ( await categoryModel.findOne( { name : req.body.name } )) {
            // return res.status(409).json( { message: "name already exist " })
            return next (new Error("name already exist ",{ cause: 409}))

        }
        req.body.slug = slugify(req.body.name)
    }

    if(req.file){
        const { public_id, secure_url}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/catagory`})
    if(!public_id) {
        // return res.status(400).json( { message: "image is required" })
        return next (new Error("image is required ",{ cause: 400}))
    }
    req.body.image = { public_id, secure_url}
    await cloudinary.uploader.destroy(catagory.image.public_id)
    }
    
    const updatedCategory= await categoryModel.findOneAndUpdate({_id: categoryId}, req.body, { new: true})
    return res.status(201).json ({ message: "done", category: updatedCategory})
}


export const deleteCategory =  
    async (req, res, next) => {
    const { categoryId } = req.params

    // 1- delete category
    const catgory = await categoryModel.findByIdAndDelete(categoryId)
    if (!catgory) return next({ cause: 404, message: 'Category not found' })

    // 2-delete the related subcategories
    const subCategories = await subCategory.deleteMany({ categoryId })
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

    res.status(200).json({ success: true, message: 'Category deleted successfully' })
}
