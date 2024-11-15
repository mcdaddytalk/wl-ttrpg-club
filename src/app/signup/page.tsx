import { SignupForm } from "@/components/SignUpForm/SignupForm";

const SignUpPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-18">
            <div className="max-w-5xl w-full items-center justify-center lg:flex space-y-4">
                <SignupForm />
            </div>
        </main>
    )
}

export default SignUpPage;