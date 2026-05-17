import { memo } from "react";
import ProjectCard from "./Projectcard";

function ProjectGrid({projects}){
    if(projects.length===0){
        return(
            <p className="text-slate-400">No projects yet</p>
        )
    }
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project)=>(
                <ProjectCard 
                    key={project._id}
                    project={project}
                />
            ))}
        </div>
    )
}

export default memo(ProjectGrid);