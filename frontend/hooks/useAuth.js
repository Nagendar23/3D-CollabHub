"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function useAuth(){
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const authenticated = isAuthenticated();
        if(!authenticated){
            router.push('/login')
        }else{
            setLoading(false)
        }
    }, []);
    return {loading}
}