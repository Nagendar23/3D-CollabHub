import Link from "next/link";
export default function FileCard({file}){
    return(
        <Link href={`/files/${file._id}`}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition cursor-pointer">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            {file.name}
                        </h2>
                        <p className="text-sm text-slate-400">
                            Version : {" "}
                            v{file.currentVersion?.versionNumber || 1}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}