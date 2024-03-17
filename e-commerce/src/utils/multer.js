import multer from "multer"
import { nanoid, customAlphabet } from "nanoid"
import fs from 'fs'
import path from "path"


const uniqueNumber=customAlphabet('123456789',5)

const localMulter= (customValidation,customPath)=>{

    if (!customValidation){
        customValidation=validExtention.image
    }

    if (!customPath){
        customPath="general"
    }

    const destPath=path.resolve(`uploads/${customPath}`)

    if(!fs.existsSync(destPath)){
        fs.mkdirSync(destPath,{recursive:true})
    }


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, destPath)
        },
        filename: function (req, file, cb) {
        const uniqueName=uniqueNumber()+file.originalname
        cb(null, uniqueName)
        }
      })
      const fileFilter = function (req, file, cb) {
        console.log(file.mimetype)
        if(customValidation.includes(file.mimetype)){
            return cb(null,true)
        }
        cb(new Error('invalid type') , false)
      
      }

    const upload = multer ({ dest: 'uploads', fileFilter, storage })

    return upload

}

export default localMulter