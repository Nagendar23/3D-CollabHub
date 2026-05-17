"use client";

import { memo, useCallback, useState } from "react";
import API from "@/lib/api";

function CreateProjectModal({ onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = useCallback(async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            setLoading(true);
            await API.post("/project", {
                title: title.trim(),
                description: description.trim(),
            });
            setTitle("");
            setDescription("");
            if (typeof onCreated === "function") onCreated();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create project");
        } finally {
            setLoading(false);
        }
    }, [title, description, onCreated]);

    const handleTitleChange = useCallback((e) => setTitle(e.target.value), []);
    const handleDescriptionChange = useCallback((e) => setDescription(e.target.value), []);

    return (
        <form onSubmit={handleCreate} className="bg-slate-800 p-5 rounded-xl border border-slate-700 mb-8 flex flex-col gap-4">

            <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={handleTitleChange}
                className="p-3 rounded bg-slate-900 border border-slate-700"
            />

            <textarea
                placeholder="Project Description"
                value={description}
                onChange={handleDescriptionChange}
                className="p-3 rounded bg-slate-900 border border-slate-700"
            />

            <button disabled={loading || !title.trim()} className="bg-blue-600 hover:bg-blue-700 p-3 rounded disabled:opacity-50">
                {loading ? "Creating..." : "Create Project"}
            </button>
        </form>
    );
}

export default memo(CreateProjectModal);