import joi from "joi";
import  generalFields  from "../../utils/generalFields.js";

export const createSubCategorySchema = joi.object({
name:generalFields.name.required(),
file:generalFields.file.required(),
categoryId:generalFields.id

}).required()



export const oneSubCategorySchema = joi.object({
    categoryId:generalFields.id,
    subCategoryId:generalFields.id
}).required()


export const updateSubCategorySchema = joi.object({
    name:generalFields.name,
    file:generalFields.file,
    categoryId:generalFields.id,
    subCategoryId:generalFields.id

}).required()
