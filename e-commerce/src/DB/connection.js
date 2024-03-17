
import mongoose from "mongoose";

const connection = async() => {
    return await mongoose.connect(process.env.DB_LOCAL)
    .then(() =>{
        console.log('connected to DB');
    }).catch(error=> {
        console.log('fail to connected');
        console.log(error);
    })
}
export default connection 