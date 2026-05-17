"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function useComments(fileId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/files/${fileId}/comments`);
      setComments(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
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
    fetch();
  }, [fileId]);

  return { comments, loading, error, fetchComments: fetch, addComment: add };
}
