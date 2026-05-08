"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginForm(){
    const router = useRouter();
    const [formData, setFormData] = useState({
        email:"",
        password:""
    })
    const [loading,setLoading] = useState(false);

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const res = await API.post("/auth/login",formData);
            saveToken(res.data.token);
            router.push('/dashboard')
        }catch(error){
            alert(error.response?.data?.message || "Login Failed")

        }finally{
            setLoading(false)
        }
    }
    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md" >
            <input type="email" name="email"
                placeholder="email"
                onChange={handleChange}
                className="p-3 rounded bg-slate-800 border border-slate-700"
            />

            <input type="password" name="password" 
                placeholder="Password"
                onChange={handleChange}
                className="p-3 rounded bg-slate-800 border border-slate-700"
            />

            <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 p-3 rounded "  >
                {loading ? "Logging in..." : "Login"}
            </button>

        </form>
    )


}