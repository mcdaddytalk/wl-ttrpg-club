import { ContactForm } from "@/components/ContactForm/ContactForm";

const JoinTheClubPage = () => {
    return (
        <section className="flex flex-col items-center justify-between">
            <div className="max-w-4xl w-full space-y-4">
                <ContactForm />
            </div>
        </section>
    )
}

export default JoinTheClubPage;