import { ContactForm } from "@/components/ContactForm/ContactForm";

const JoinTheClubPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-18">
            <div className="z-10 max-w-5xl w-full items-center justify-center lg:flex space-y-4">
                <ContactForm />
            </div>
        </main>
    )
}

export default JoinTheClubPage;