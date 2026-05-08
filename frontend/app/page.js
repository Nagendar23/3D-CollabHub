"use client";

import API from '@/lib/api'

export default function HomePage(){
  const testAPI = async()=>{
    try{
      const res = await API.get("/project");
      console.log(res.data)
    }catch(err){
      console.log(err.response?.data)
    }
  };
  return(
    <main className='p-10'>
      <button onClick={testAPI} className='bg-blue-500 px-4 py-2 rounded '>
        TEST API
      </button>
    </main>
  )
}