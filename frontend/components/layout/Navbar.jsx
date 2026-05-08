"use client";

import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

export default function Navbar(){
    const router = useRouter();
    const handleLogout = ()=>{
        removeToken();
        router.push('/login')
    }
    return(
        <nav className="flex justify-between items-center p-4 border-b border-slate-700">
            <h1 className="text-xl font-bold">
                3D Platform
            </h1>
            <button onClick={handleLogout} className="bg-red-500 px-4 rounded">
                Logout
            </button>
        </nav>
    )
}