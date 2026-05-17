"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import useAuth from "@/hooks/useAuth";
import useFiles from "@/hooks/useFiles";
import FileUpload from "@/components/files/FileUpload";
import FileList from "@/components/files/FileList";

export default function ProjectPage() {
  const { id } = useParams();
  const { loading: authLoading } = useAuth();

  const { files, loading, error, fetchFiles } = useFiles(id);
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <>
      <Navbar />

      <main className="min-h-screen p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Project Workspace</h1>

          <p className="text-slate-400">Upload and manage 3D files</p>
        </div>

        <FileUpload projectId={id} onUploaded={fetchFiles} />

        {error ? <p>{error}</p> : <FileList files={files} />}
      </main>
    </>
  );
}
