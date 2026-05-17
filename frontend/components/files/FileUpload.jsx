"use client";

import { useRef, useState } from "react";
import API from "@/lib/api";

export default function FileUpload({
    projectId,
    onUploaded
}){
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async()=>{
        if(!file) {
            alert("Please choose a file first");
            return;
        }
        try{
            setLoading(true)
            const formData = new FormData();
            formData.append("file",file);

            await API.post(`/files/${projectId}/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            setFile(null);
            await onUploaded?.();

        }catch(error){
            alert(error.response?.data?.message || "Upload failed")
        }finally{
            setLoading(false)
        }
    }
    return(
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload 3D File</h2>

            <input
                ref={fileInputRef}
                type="file"
                onChange={(e)=> setFile(e.target.files?.[0] || null)}
                className="hidden"
            />

            <button
                type="button"
                onClick={handleChooseFile}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded mr-3"
            >
                {file ? "Change File" : "Choose File"}
            </button>

            <button type="button" onClick={handleUpload} disabled={loading || !file}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded"
            >
                {loading? "Uploading" : "Upload"}
            </button>

            <p className="mt-3 text-sm text-slate-400">
                {file ? `Selected: ${file.name}` : "No file selected yet"}
            </p>
        </div>
    )
}