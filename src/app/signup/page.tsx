import { SignupForm } from "@/components/SignUpForm/SignupForm";

const SignUpPage = () => {
    return (
        <section className="flex flex-col items-center justify-between">
            <div className="max-w-4xl w-full space-y-4">
                <SignupForm />
            </div>
        </section>
    )
}

export default SignUpPage;