import joi from "joi";
import  generalFileds  from "../../utils/generalFields.js";


export const createBrandSchema = joi.object({
name:generalFileds.name.required(),
file:generalFileds.file.required()
}).required()


export const oneBrandSchema = joi.object({
    brandId:generalFileds.id
}) 


export const updateBrandSchema = joi.object({
    name:generalFileds.name,
    file:generalFileds.file,
    brandId:generalFileds.id
}).required()
