import joi from "joi";
import  generalFields  from "../../utils/generalFields.js";
export const tokenSchema = joi.object({
    authorization:joi.string().required()
}).required()
  
export const createProductSchema=joi.object({
name:generalFields.name.required(),
categoryId:generalFields.id,
subCategoryId:generalFields.id,
brandId:generalFields.id,
price:joi.number().min(1).positive().required(),
discount:joi.number().min(1).max(100).positive(),
stock:joi.number().integer().min(1).positive().required(),
files:joi.object({
mainImage:joi.array().items(generalFields.file.required()).required(),
subImages:joi.array().items(generalFields.file)
}).required(),
description:joi.string().min(5).max(1000),
size:joi.array().items(joi.string().required()),
colors:joi.array().items(joi.string().required())
}).required()

export const getProduct=joi.object({
    productId:generalFields.id
})