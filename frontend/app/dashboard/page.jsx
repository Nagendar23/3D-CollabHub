"use client"

import useAuth from "@/hooks/useAuth"
import Navbar from "@/components/layout/Navbar";
import useProjects from "@/hooks/useProtects";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CreateProjectModal from "@/components/projects/CreateProjectModel";

export default function DashboardPage(){
    const {loading:authLoading  } = useAuth();

    const{
        projects,
        loading,
        error,
        fetchProjects
    } = useProjects();
    if(authLoading || loading){
        return(
            <div className="min-h-screen  flex items-center justify-center">Loading...</div>
        )
    }
    return(
        <>
            <Navbar/>
            <main className="min-h-screen p-10">
                <div className="flex justify-between items-center mb-8 ">
                    <div>
                        <h1 className="text-4xl font-bold">Dashboard</h1>
                        <p className="text-slate-400 mt-2">
                            Manage your 3D Projects
                        </p>
                    </div>
                </div>
                <CreateProjectModal onCreated={fetchProjects} />
                {error ? (
                    <p>{error}</p>
                ): (
                    <ProjectGrid projects={projects} />
                )}
            </main>
        </>
    )

}