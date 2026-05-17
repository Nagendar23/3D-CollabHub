"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Navbar from "@/components/layout/Navbar";
import useAuth from "@/hooks/useAuth";
import useFile from "@/hooks/useFile";
import useFileVersions from "@/hooks/useFileVersions";
import { useDeleteFile } from "@/hooks/useDeleteFile";
import VersionList from "@/components/files/VersionList";
import ModelViewer from "@/components/viewer/ModelViewer";
import CommentSection from "@/components/files/CommentSection";

export default function FilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { loading: authLoading } = useAuth();
    const { file, loading, error } = useFile(id);
    const { versions, loading: versionsLoading } = useFileVersions(id);
    const { deleteFile, loading: deleteLoading } = useDeleteFile();
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [modelLoading, setModelLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteFile = async () => {
        try {
            await deleteFile(id);
            router.push("/dashboard");
        } catch (error) {
            alert("Failed to delete file: " + (error.response?.data?.message || error.message));
            setShowDeleteConfirm(false);
        }
    };

    // Keep selected version in sync when file loads or currentVersion changes
    useEffect(()=>{
        setSelectedVersion(file?.currentVersion || null);
    },[file?.currentVersion]);

    // When selected version changes, show model loading overlay until model reports loaded
    useEffect(()=>{
        if(selectedVersion) setModelLoading(true);
    },[selectedVersion?.fileUrl, selectedVersion?._id]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 text-center text-red-400">
                {error}
            </div>
        );
    }

    const currentVersion = file?.currentVersion;
    const updatedAt = currentVersion?.createdAt
        ? new Date(currentVersion.createdAt).toLocaleString()
        : "Unknown";

    return (
        <>
            <Navbar />

            <main className="min-h-screen p-10">
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-3xl font-bold">{file.name}</h1>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                            type="button"
                        >
                            Delete File
                        </button>
                    </div>
                    <p className="text-slate-400">File details and 3D preview</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                        <p className="text-sm text-slate-400">Current Version</p>
                        <p className="text-lg font-semibold">v{currentVersion?.versionNumber || 1}</p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                        <p className="text-sm text-slate-400">File Type</p>
                        <p className="text-lg font-semibold">{currentVersion?.fileType || "Unknown"}</p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                        <p className="text-sm text-slate-400">Updated</p>
                        <p className="text-lg font-semibold">{updatedAt}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        {selectedVersion?.fileUrl ? (
                            <ModelViewer fileUrl={selectedVersion.fileUrl} fileName={file.name} loading={modelLoading} onLoaded={()=>setModelLoading(false)} />
                        ) : (
                            <div className="rounded-xl border border-slate-700 bg-slate-800 p-10 text-center text-slate-400">
                                No version is available for this file yet.
                            </div>
                        )}
                    </div>

                    <aside className="md:col-span-1">
                        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                            <h3 className="font-semibold mb-3">Versions</h3>
                            <VersionList
                                versions={versions}
                                loading={versionsLoading}
                                selectedId={selectedVersion?._id}
                                onSelect={(v)=> setSelectedVersion(v)}
                            />
                        </div>
                        <div className="mt-4">
                            <CommentSection fileId={id} />
                        </div>
                    </aside>
                </div>

                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-xl max-w-sm">
                            <h3 className="text-lg font-semibold mb-2">Delete File?</h3>
                            <p className="text-slate-400 mb-6">
                                This will delete "{file.name}" and all its versions. This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteFile}
                                    disabled={deleteLoading}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm disabled:opacity-50"
                                >
                                    {deleteLoading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}