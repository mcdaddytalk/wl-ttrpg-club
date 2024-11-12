import { NewContact } from "@/lib/types/custom";

interface EmailTemplateProps {
    contact: NewContact
  }
  
  export const NewContactEmail: React.FC<Readonly<EmailTemplateProps>> = ({
    contact
  }) => (
    <div>
      <h1>New Contact Web Submission!!</h1>
      <p>First Name: {contact.firstName}</p>
      <p>Surname: {contact.surname}</p>
      <p>Email: {contact.email}</p>
      <p>Phone Number: {contact.phoneNumber}</p>
      <p>Is A Minor: {contact.isMinor}</p>
      <p>Parent First Name: {contact.parentFirstName}</p>
      <p>Parent Surname: {contact.parentSurname}</p>
      <p>Parent Email: {contact.parentEmail}</p>
      <p>Parent Phone Number: {contact.parentPhone}</p>
      <p>Experience Level: {contact.experienceLevel}</p>
      <p>Gamemaster Interest: {contact.gamemasterInterest}</p>
      <p>Preferred System: {contact.preferredSystem}</p>
      <p>Availability: {contact.availability}</p>
      <p>Agree To Rules: {contact.agreeToRules}</p>
    </div>
  );