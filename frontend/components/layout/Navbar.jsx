"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

function Navbar() {
    const router = useRouter();
    const handleLogout = useCallback(() => {
        removeToken();
        router.push("/login");
    }, [router]);

    return (
        <nav className="flex justify-between items-center p-4 border-b border-slate-700">
            <h1 className="text-xl font-bold">3D Platform</h1>
            <button onClick={handleLogout} className="bg-red-500 px-4 rounded">
                Logout
            </button>
        </nav>
    );
}

export default memo(Navbar);