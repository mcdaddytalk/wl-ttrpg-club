import { SignUpForm } from "@/components/Form/SignUpForm";

const JoinTheClubPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-18">
            <div className="z-10 max-w-5xl w-full items-center justify-center lg:flex space-y-4">
                <SignUpForm />
            </div>
        </main>
    )
}

export default JoinTheClubPage;