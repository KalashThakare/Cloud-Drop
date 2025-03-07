import mongoose from "mongoose";

function connectToDb(){
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("DataBase connnected");
    }).catch(err=>{
        console.log(err);
    })
}

export default connectToDb;