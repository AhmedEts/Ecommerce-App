import joi from "joi"
import { Types } from "mongoose"
export const validationObjectId = (value, helper) => {
    return Types.OjectId.isValid(value) ? true : helper.message('In-vaild objectId')
}

 const generalFields = {
    authorization: joi.string().required(),
    email: joi.string().email({ 
        tlds: { allow: ['com', 'org', 'yahoo'] } 
    }).required(),
    name:joi.string().min(3).max(20),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    cPassword:joi.string().valid(joi.ref("password")).required(),
    id: joi.custom(validationObjectId).required(),
    file: joi.object ({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname:joi.string().required(),

    })
}

export default generalFields