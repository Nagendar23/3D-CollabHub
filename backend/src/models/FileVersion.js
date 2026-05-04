import mongoose, { mongo } from "mongoose";
const fileVersionSchema = new mongoose.Schema({
    file:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"File",
        required:true,
    },
    versionNumber:Number,
    fileUrl:String,
    publicId:String,
    fileType:String,
    fileSize:Number,
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export default mongoose.model("FileVersion",fileVersionSchema);