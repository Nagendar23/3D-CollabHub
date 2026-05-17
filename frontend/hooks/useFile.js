"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function useFile(fileId) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFile = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await API.get(`/files/${fileId}`);
                setFile(res.data);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch file");
            } finally {
                setLoading(false);
            }
        };

        if (fileId) {
            fetchFile();
        }
    }, [fileId]);

    return {
        file,
        loading,
        error,
    };
}