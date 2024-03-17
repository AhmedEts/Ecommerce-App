import joi from "joi";
import generalFields  from "../../utils/generalFields.js";


export const createCategorySchema = joi.object({
name:generalFields.name.required(),
file:generalFields.file.required(),
}).required()


export const tokenSchema = joi.object({
    authorization:joi.string().required()
}).required()
 

export const oneCategorySchema = joi.object({
    categoryId:generalFields.id
}).required().messages({
    'custom':"invalid-id"
})


export const updateCategorySchema = joi.object({
    name:generalFields.name,
    file:generalFields.file,
    categoryId:generalFields.id
}).required()


