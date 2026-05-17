import axios from "axios";

const fallbackBaseURL = "http://localhost:8000/api";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || fallbackBaseURL
});

API.interceptors.request.use((config)=>{
    if(typeof window !== "undefined"){
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
    }
    return config;
})

export default API;