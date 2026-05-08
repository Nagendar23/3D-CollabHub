import SignUpForm from "@/components/auth/SignUpForm";

export default function SignupPage(){
    return(
        <main className="min-h-screen flex items-center">
            <div className="w-full max-w-md p-6">
                <h1 className="text-3xl font-bold mb-6"> 
                    Create Account
                </h1>
                <SignUpForm/>
            </div>
        </main>
    )
}