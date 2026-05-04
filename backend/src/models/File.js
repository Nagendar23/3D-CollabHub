import mongoose, { mongo } from "mongoose";

const fileSchema = new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    currentVersion:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FileVersion"
    }
},{timestamps:true})

export default mongoose.model("File",fileSchema)