import { div } from "three/tsl";
import FileCard from "./FileCard";
export default function FileList({files}){
    if(files.length===0){
        return(
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
                <p className="text-slate-400">No files uploaded yet</p>
            </div>
        )
    }
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {files.map((file)=>(
                <FileCard 
                    key={file._id}
                    file={file}
                />
            ))}
        </div>
    )
}