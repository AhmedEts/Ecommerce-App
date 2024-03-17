import joi from 'joi'
import generalFields from '../../utils/generalFields.js'



    export const signupSchema = joi.object({
    firstName : joi.string().min(3).max(20).required(),
    lastName : joi.string().min(3).max(20).required(),
    email : generalFields.email,
    password : generalFields.password,
    cPassword : joi.string().valid(joi.ref('password')).required(),
    DOB : joi.string().isoDate(),
    mobileNumber :joi.string().trim().pattern(/^01[0-2]\d{8}$/).required(),
    role : joi.string().valid('User','Admin'),
    gender:joi.string().valid('Female','Male'),
    status:joi.string().valid('Offline','Online'),
    address : joi.string(),
    image : joi.string()
    }).required()
    
    export const logInSchema = joi.object({
      email: generalFields.email,
      password: generalFields.password,
      mobileNumber: joi.string()
        .trim()
        .pattern(/^01[0-2]\d{8}$/),
    }).required();
    
    export const authSchema = joi.object({
            auth: joi.string().required()
        }).required()
    
    export const sendCodeSchema = joi.object({
        email: generalFields.email
    }).required()
    
    export const forgetPasswordSchema = joi.object({
        email : generalFields.email,
        newPassword : generalFields.password,
        cPassword : joi.string().valid(joi.ref('newPassword')).required(),
        code : joi.string().pattern(new RegExp(/^\d{5}$/)).required()
    
    }).required()
        
    //updatePasswordSchema
    export const updatePasswordSchema = joi.object({
        userId: generalFields.id,
        oldPassword:generalFields.password,
        newPassword:generalFields.password
    }).required();
    
    //updateSchema
    export const updateSchema = joi.object({
      email: joi.string().email({ tlds: { allow: ["com", "net"] } }),
      mobileNumber: joi.string()
        .trim()
        .pattern(/^01[0-2]\d{8}$/),
      recoveryEmail: joi.string().email({ tlds: { allow: ["com", "net"] } }),
      DOB: joi.string().isoDate(),
      firstName: joi.string().min(3).max(20),
      lastName: joi.string().min(3).max(20),
      userId: generalFields.id,
    }).required();
    
        //delete schema
    export const deleteSchema = joi.object({
        userId : generalFields.id
        }).required()