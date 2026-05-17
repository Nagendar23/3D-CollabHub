"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";

export default function useFiles(projectId){
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    const fetchFiles = async()=>{
        try{
            setLoading(false)
            const res = await API.get(`/files/project/${projectId}`);
            setFiles(res.data)
        }catch(error){
            setError(error.response?.data?.message || "failed to fetch files")
        }finally{
            setLoading(false)
        }
    };
    useEffect(()=>{
        if(projectId){
            fetchFiles();
        }
    },[projectId]);
    return{
        files,
        loading,
        error,
        fetchFiles
    };
}