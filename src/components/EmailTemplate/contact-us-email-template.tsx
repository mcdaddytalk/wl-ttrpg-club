

interface ContactUsEmailTemplateProps {
    name: string;
    email: string;
    message: string;
}

export const ContactUsEmail = ({ name, email, message }: ContactUsEmailTemplateProps) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6 }}>
      <h2>New Contact Us Submission</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style={{ background: '#f9f9f9', padding: '1em', borderLeft: '4px solid #ccc' }}>
        {message}
      </blockquote>
    </div>
  );