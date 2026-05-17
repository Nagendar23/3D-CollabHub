"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function useFileVersions(fileId) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/files/${fileId}/versions`);
                setVersions(res.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch versions");
            } finally {
                setLoading(false);
            }
        };

        if (fileId) fetch();
    }, [fileId]);

    return { versions, loading, error };
}
