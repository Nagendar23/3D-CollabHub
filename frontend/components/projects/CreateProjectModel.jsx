"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function CreateProjectModal({onCreated}){
    const[title, setTitle] = useState("");
    const [description, setDescription ] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleCreate = async(e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            await API.post("/project",{
                title,
                description
            });
            setTitle("");
            setDescription("");
            onCreated();
        }catch(error){
            alert(error.response?.data?.message || "Failed to create project")
        }finally{
            setLoading(false)
        }
    }
    return(
        <form onSubmit={handleCreate} className="bg-slate-800 p-5 rounded-xl border border-slate-700 mb-8 flex flex-col gap-4  " >

            <input type="text" placeholder="Project Title" 
                value={title}
                onChange={(e)=> setTitle(e.target.value)}
                className="p-3 rounded bg-slate-900 border border-slate-700"
            />

            <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e)=> setDescription(e.target.value)}
                className="p-3 rounded bg-slate-900 border border-slate-700"
           />

           <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 p-3 rounded" >
                {loading ? "Creating" : "Create Project"}
           </button>
        </form>
    )
}