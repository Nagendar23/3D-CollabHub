"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function useFile(fileId) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchFile = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await API.get(`/files/${fileId}`, { signal: controller.signal });
                setFile(res.data);
            } catch (error) {
                if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                    return;
                }
                setError(error.response?.data?.message || "Failed to fetch file");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        if (fileId) {
            setFile(null);
            fetchFile();
        }

        return () => controller.abort();
    }, [fileId]);

    return {
        file,
        loading,
        error,
    };
}