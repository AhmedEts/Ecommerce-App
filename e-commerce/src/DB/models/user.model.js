
import mongoose, { Schema, model } from 'mongoose';
import  systemRoles  from "../../utils/systemRoles.js";


const userSchema = new Schema({

    userName: {
        type:String,
        unique: true,
        require: [true, 'userName is required'],
        min: [ 2, 'minimum length is char'],
        max: [ 20, 'maximum length is char']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, ' email must be unique value']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    age: Number,
    gender:{
        type: String,
        enum: ["female","male" ],
        default:"male" 
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status :{
        type: String,
        default: 'Offline',
        enum: ['Offline', 'Online']

    },
    phone :{
        type : String,
    },
    address: String,
    image: String,
    DOB: String,
    // wishlist:[]

},{
    timestamps: true
})


const userModel=mongoose.model.User || model ('User', userSchema)

export default userModel;