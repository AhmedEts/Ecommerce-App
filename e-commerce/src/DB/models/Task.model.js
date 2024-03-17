import { Schema, model } from 'mongoose'

const taskSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum:[ "toDo", "doing", "done" ],
        default: "toDo",
    },
    userID:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true 
    },
    assignTo: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    deadline : String, 
    },
    {timestamps : true}
);

const taskModel = model('task', taskSchema);

export default taskModel