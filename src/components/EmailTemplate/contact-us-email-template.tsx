

interface ContactUsEmailTemplateProps {
    name: string;
    email: string;
    message: string;
}

export const ContactUsEmail = ({ name, email, message }: ContactUsEmailTemplateProps) => {
    return (
        <div>
            <h1>Contact Us</h1>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            <p>Message: {message}</p>
        </div>
    );
};