import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage(){
    return(
        <main className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md p-6">
                <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
                <LoginForm/>
            </div>  

        </main>
    )
}