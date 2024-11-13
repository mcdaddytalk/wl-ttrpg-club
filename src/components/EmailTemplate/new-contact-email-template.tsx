
interface EmailTemplateProps {
    firstName: string;
    surname: string;
    email: string;
    phoneNumber: string;
    isMinor: boolean;
    parentFirstName?: string;
    parentSurname?: string;
    parentEmail?: string;
    parentPhone?: string;
    experienceLevel: string;
    gamemasterInterest: string;
    preferredSystem: string;
    availability: string;
    agreeToRules: boolean;
  }
  
  export const NewContactEmail: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    surname,
    email,
    phoneNumber,
    isMinor,
    parentFirstName,
    parentSurname,
    parentEmail,
    parentPhone,
    experienceLevel,
    gamemasterInterest,
    preferredSystem,
    availability,
    agreeToRules
  }) => (
      <div>
        <h1>New Contact Web Submission!!</h1>
        <p>First Name: {firstName}</p>
        <p>Surname: {surname}</p>
        <p>Email: {email}</p>
        <p>Phone Number: {phoneNumber}</p>
        <p>Is A Minor: {isMinor}</p>
        <p>Parent First Name: {parentFirstName ?? "None"}</p>
        <p>Parent Surname: {parentSurname ?? "None"}</p>
        <p>Parent Email: {parentEmail ?? "None"}</p>
        <p>Parent Phone Number: {parentPhone ?? "None"}</p>
        <p>Experience Level: {experienceLevel}</p>
        <p>Gamemaster Interest: {gamemasterInterest}</p>
        <p>Preferred System: {preferredSystem}</p>
        <p>Availability: {availability}</p>
        <p>Agree To Rules: {agreeToRules}</p>
      </div>
    );