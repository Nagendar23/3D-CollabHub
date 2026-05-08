"use client";

import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project._id}`}>
      <div className="bg-black p-5 rounded-xl border border-slate-700 hover:border-slate-500 transition cursor-pointer   ">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
        <p>{project.description || "No description"}</p>
      </div>
    </Link>
  );
}
