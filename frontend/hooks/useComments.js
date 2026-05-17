"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function useComments(fileId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async (signal) => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/files/${fileId}/comments`, { signal });
      setComments(res.data || []);
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }
      setError(err.response?.data?.message || "Failed to fetch comments");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const add = async (text) => {
    const res = await API.post(`/files/${fileId}/comments`, { text });
    // prepend new comment
    setComments((prev) => [res.data, ...prev]);
    return res.data;
  };

  useEffect(() => {
    if (!fileId) return;
    const controller = new AbortController();
    setComments([]);
    fetch(controller.signal);

    return () => controller.abort();
  }, [fileId]);

  return { comments, loading, error, fetchComments: fetch, addComment: add };
}
