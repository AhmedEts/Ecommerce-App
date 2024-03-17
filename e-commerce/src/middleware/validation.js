import { Types } from 'mongoose'

export const validationId = (value, helper) => {
    return Types.ObjectId.isValid(value) ?
        true :
        helper.message('invalid format of id')
}
const validation = (schema) => {
    return (req, res, next) => {
        const { authorization } = req.headers //data ,undefined
        let data;
        if (authorization) {
            data = { ...req.body, ...req.params, ...req.query, authorization }
        } else {
            data = { ...req.body, ...req.params, ...req.query }
        }


        if (req.file) {
            data = { ...data, image: req.file }
        }

        if (req.files) {
            data = { ...data, files: req.files }
        }
        console.log(data);
        const validationResult = schema.validate(data, { abortEarly: false })
        if (validationResult.error) {
            return res.json({ message: "catch validation error", validationResult })
        }
        next()
    }
}
export default validation