import mongoose,{  Schema, Types, model } from "mongoose"

const categorySchema= new Schema ({
    name:{ 
        type:String,
        unique: [true, 'name must be unique'],
        required:[true, 'name is required'],
        trim: true,
        lowercase: true

    },
    slug:{ 
        type:String,
        unique: [true, 'slug must be unique'],
        required:[true, 'slug is required'],
        trim: true,
        lowercase: true
    },
    image: {
        type: Object,
        required: [true, 'Image is required'] 
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: [false, 'userId is required'] // replace to true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }


},{
timestamps: true,
toJSON: {virtuals:true},
toObject: {virtuals: true}
})

categorySchema.virtual('subCategory',{
    ref: 'SubCategory',
    localField: '_id',
    foreignField: 'categoryId'
});

const categoryModel= mongoose.model.Category || model('category', categorySchema)

export default categoryModel