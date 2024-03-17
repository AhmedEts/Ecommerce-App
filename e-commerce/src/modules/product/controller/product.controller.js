import slugify from "slugify"
import categoryModel from "../../../DB/models/Category.model.js"
import productModel from "../../../DB/models/Product.model.js"
import subCategoryModel from "../../../DB/models/SubCategory.model.js"
import { nanoid } from "nanoid"
import brandModel from "../../../DB/models/Brand.model.js"
import cloudinary from "../../../utils/cloudinary.js"

export const createProduct = async (req,res,next) => {
    const {categoryId,subCategoryId,brandId}=req.body

    if(!await categoryModel.findOne({_id:categoryId,isDeleted:false})){
        return next(new Error('category not founded',{cause:404}))
    }

    if(!await subCategoryModel.findOne({_id:subCategoryId,isDeleted:false,categoryId})){
        return next(new Error('subCategory not founded',{cause:404}))
    }

    if(!await brandModel.findOne({_id:brandId,isDeleted:false})){
        return next(new Error('brand not founded',{cause:404}))
    }

    req.body.slug=slugify(req.body.name,{
        trim:true,
        lower:true
    })


    req.body.totalPrice =  req.body.price -  ((req.body.price* req.body.discount || 0)/100)
    req.body.customId= nanoid()

 const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,
        {folder:`eCommerce/category/${categoryId}/subCategory/${subCategoryId}/products/${req.body.customId}/mainImage`})

    if(!public_id){
        return next(new Error("image is required"))
    }
req.body.mainImage= {secure_url,public_id}

let images= []


if(req.files?.subImages?.length){

    for (const image of req.files.subImages) {
        console.log(image.path);
        const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,
            {folder:`eCommerce/category/${categoryId}/subCategory/${subCategoryId}/products/${req.body.customId}/subImages`})
        if(!public_id){
            return next(new Error("images is required"))
    
        }
        images.push({secure_url,public_id})
    }
    req.body.subImages=images
}


req.body.createdBy=req.user._id
  const product = await productModel.create(req.body)
return res.status(200).json({message:"done",product})
}


export const getAllProducts= async (req,res,next)=>{

    const products= await productModel.find()
    return res.status(200).json({message:"done",products})
}
export const getOneProduct= async (req,res,next)=>{

    const product= await productModel.findById({_id:req.params.productId})
    return res.status(200).json({message:"done",product})
}