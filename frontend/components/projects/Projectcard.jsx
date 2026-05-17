"use client";

import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useRouter } from "next/navigation";

function ProjectCard({ project }) {
  const router = useRouter();
  const { deleteProject, loading } = useDeleteProject();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteProject(project._id);
      router.refresh();
    } catch (error) {
      alert("Failed to delete project: " + (error.response?.data?.message || error.message));
    }
  }, [deleteProject, project._id, router]);

  const openConfirm = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return (
    <>
      <Link href={`/projects/${project._id}`}>
        <div className="bg-black p-5 rounded-xl border border-slate-700 hover:border-slate-500 transition cursor-pointer relative group">
          <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
          <p className="text-slate-400 mb-4">{project.description || "No description"}</p>
          
          <button
            onClick={openConfirm}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition"
            type="button"
          >
            Delete
          </button>
        </div>
      </Link>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>
            <p className="text-slate-400 mb-6">
              This will delete "{project.title}" and all its files. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ProjectCard);
