"use client";

import { useCallback, useEffect, useState } from "react";
import API from "@/lib/api";

export default function useProjects(){
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const fetchProjects = useCallback(async (signal) => {
        try {
            setLoading(true);
            setError("");
            const res = await API.get('/project', { signal });
            setProjects(res.data);
        } catch (error) {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return;
            }
            setError(error.response?.data?.message || "Failed to fetch projects");
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [])

    useEffect(()=>{
        const controller = new AbortController();
        fetchProjects(controller.signal);

        return () => controller.abort();
    },[fetchProjects]);

    return{
        projects,
        loading,
        error,
        fetchProjects
    }
}