import joi from 'joi'
import generalFields from '../../utils/generalFields.js'




export const signupSchema = joi.object({
    email: generalFields.email,
    name: joi.string().min(3).max(20).required(),
    gender: joi.string().valid('male', 'female'),
    oldpassword: generalFields.password,
    newPassword: generalFields.password,
    cPassword: joi.string().valid(joi.ref('password'))
}).required()


export const logInSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password
}).required()


export const changePasswordSchema = joi.object({
    authorization: generalFields.authorization,
    oldPassword: generalFields.password,
    newPassword: generalFields.password,
    cPassword: joi.string().valid(joi.ref('newPassword')).required()
}).required()
