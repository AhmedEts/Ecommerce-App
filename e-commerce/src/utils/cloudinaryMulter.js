import multer from "multer";



export const fileValidation ={ 
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    file: ['application/pdf', 'application/msword'],
    video: ['video/mp4']
};
 const uploadFilecloud = (customValidation)=>{

    if (!customValidation){
        customValidation=validExtention.image
    }

    const storage = multer.diskStorage({})

    const fileFilter = function (req, file, cb) {
        if(customValidation.includes(file.mimetype)){
             cb(null,true)
        } else{
        cb(new Error('invalid type') , false)
        }
    }
 
    const upload = multer({ fileFilter, storage })
    return upload

}  
export default uploadFilecloud;