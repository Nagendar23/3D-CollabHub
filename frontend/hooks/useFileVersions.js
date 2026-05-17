"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

// simple in-memory cache to avoid refetching versions repeatedly
const versionsCache = new Map();

export default function useFileVersions(fileId) {
    const [versions, setVersions] = useState(() => versionsCache.get(fileId) || []);
    const [loading, setLoading] = useState(!versionsCache.has(fileId));
    const [error, setError] = useState("");

    useEffect(() => {
        if (!fileId) {
            setVersions([]);
            setLoading(false);
            return;
        }

        if (versionsCache.has(fileId)) {
            setVersions(versionsCache.get(fileId));
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchVersions = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await API.get(`/files/${fileId}/versions`, { signal: controller.signal });
                const data = res.data || [];
                versionsCache.set(fileId, data);
                if (!controller.signal.aborted) setVersions(data);
            } catch (err) {
                if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
                    return;
                }
                setError(err.response?.data?.message || "Failed to fetch versions");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchVersions();

        return () => controller.abort();
    }, [fileId]);

    return { versions, loading, error };
}
