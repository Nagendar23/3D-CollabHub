"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";

export default function useProjects(){
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const fetchProjects = async ()=>{
        try{
            setLoading(true);
            const res = await API.get('/project')
            setProjects(res.data)
            setError("")
        }catch(error){
            setError(error.response?.data?.message || "Failed to fetch projects")
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchProjects();
    },[]);

    return{
        projects,
        loading,
        error,
        fetchProjects
    }
}