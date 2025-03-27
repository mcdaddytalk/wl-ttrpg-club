import { z } from 'zod';
import { isMobilePhone } from 'validator';

const phoneValidation = new RegExp(
    /^(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/
)

// Date helper to calculate age
//const calculateAge = (birthday: Date) => {
//    const ageDifMs = Date.now() - birthday.getTime();
//    const ageDate = new Date(ageDifMs);
//    return Math.abs(ageDate.getUTCFullYear() - 1970);
//  };
  
// Phone validator to ensure valid phone number or 000-000-0000 (not used for parent validateion)
const isPhoneOrNoContact = (phone: string): boolean => {
    // logger.log('TELEPHONE:  ', phone)
    const noContactNumbers = ['+1 000-000-0000', '000000000', '000-000-0000']
    if (noContactNumbers.includes(phone)) return true
    return isMobilePhone(phone)
}

// Step 1 - Personal Information
export const personalInfoSchema = z.object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    birthday: z.string().refine((val) => new Date(val) <= new Date(), "Birthday must be date in the past"),
    email: z.string().email("Enter a valid email, or for no contact 'no-contact@email.com'"),
    phoneNumber: z.string({ message: "Enter valid phone number or for no contact '000-000-0000'" })
        .min(10, "Phone number is too short")
        .regex(phoneValidation,"Please enter a valid US Phone Number")
        .refine((phone) => isPhoneOrNoContact(phone), { message: "Enter a valid phone number"})
});

// Step 2 - Parent's Information (for minors)
export const parentInfoSchema = z.object({
    parentFirstName: z.string().min(1, "Parent's first name is required"),
    parentSurname: z.string().min(1, "Parent's surname is required"),
    parentPhone: z.string({ message: "Enter valid phone number" })
        .min(10, "Phone number is too short")
        .regex(phoneValidation,"Please enter a valid US Phone Number")
        .refine((phone) => isMobilePhone(phone), { message: "Enter a valid phone number"}),
    parentEmail: z.string().email("Email must be valid"),
});

// Step 3 - Demographics
export const demographicsSchema = z.object({
    experienceLevel: z.enum(["new", "novice", "seasoned", "player-gm", "forever-gm"], { message: "Select your player experence level" }),
    gamemasterInterest: z.enum(["yes", "no", "maybe"], { message: "Would you be interested in joining or Gamemaster Pool?" }),
    preferredSystem: z.enum(["pf2e", "dd5e"], { message: "Preferred System" }),
    availability: z.string({ message: "When are you generally available to come to the table" }).min(1, 'Please provide availablility'),
    mayContact: z.boolean({ message: "May we contact you about future games?" }).default(false)
});
  
// Final Step - Agreement
export const agreementSchema = z.object({
    agreeToRules: z.boolean().refine((val) => val === true, "You must agree to the rules.").default(false),
});

const baseSchema = z.object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    email: z.string().email("Enter a valid email, or for no contact 'no-contact@email.com'"),
    phoneNumber: z.string({ message: "Enter valid phone number or for no contact '+1 000-000-0000'" })
        .min(10, "Phone number is too short")
        .regex(phoneValidation,"Please enter a valid US Phone Number")
        .refine((phone) => isPhoneOrNoContact(phone), { message: "Enter a valid phone number"}),
    experienceLevel: z.enum(["new", "novice", "seasoned", "player-gm", "forever-gm"], { message: "Select your player experence level" }),
    gamemasterInterest: z.enum(["yes", "no", "maybe"], { message: "Would you be interested in joining or Gamemaster Pool?" }),
    preferredSystem: z.enum(["pf2e", "dd5e", "other", "none"], { message: "Preferred System" }),
    availability: z.string({ message: "When are you generally available to come to the table" }).min(1, 'Please provide availablility'),
    agreeToRules: z.boolean().refine((val) => val === true, "You must agree to the rules.").default(false)
});

const minorSchema = z.object({
    isMinor: z.literal(true),
    parentFirstName: z.string()
        .min(1, "Parent's first name is required"),
    parentSurname: z.string()
        .min(1, "Parent's surname is required"),
    parentPhone: z.string({ message: "Enter valid phone number" })
        .min(10, "Phone number is too short")
        .regex(phoneValidation,"Please enter a valid US Phone Number")
        .refine((phone) => isMobilePhone(phone), { message: "Enter a valid phone number"}),
    parentEmail: z.string().email("Email must be valid")
});

const nonMinorSchema = z.object({
    isMinor: z.literal(false),
    parentFirstName: z.string()
        .min(1, "Parent's first name is required")
        .optional()
        .or(z.literal('')),
    parentSurname: z.string()
        .min(1, "Parent's surname is required")
        .optional()
        .or(z.literal('')),
    parentPhone: z.string({ message: "Enter valid phone number" })
        .min(10, "Phone number is too short")
        .regex(phoneValidation,"Please enter a valid US Phone Number")
        .refine((phone) => isMobilePhone(phone), { message: "Enter a valid phone number"})
        .optional()
        .or(z.literal('')),
    parentEmail: z.string().email("Email must be valid")
        .optional()
        .or(z.literal(''))
});

export const formSchema = z.discriminatedUnion(
    'isMinor',
    [
        minorSchema.merge(baseSchema),
        nonMinorSchema.merge(baseSchema)
    ]
).superRefine((data, ctx) => {
    const defaultEmail = "no-contact@email.com";
    const defaultPhone = [ "+1 000-000-0000", "000-000-0000", "0000000000", "000 000 0000" ];
  
    // Convert the email to lowercase
    data.email = data.email.toLowerCase();
  
    // Validate that both email and phoneNumber are not the default
    if (data.email === defaultEmail && defaultPhone.includes(data.phoneNumber)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Both email and phone number cannot be defaults. Provide at least one valid contact method.",
            path: ['email'], // Attach error to email field
        });
      
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Both email and phone number cannot be defaults. Provide at least one valid contact method.",
            path: ['phoneNumber'], // Attach error to phoneNumber field
        });
    }

    // Modify email if it is the default
    if (data.email === defaultEmail) {
        data.email = `no-contact-${data.firstName.toLowerCase()}-${data.surname.toLowerCase()}@email.com`;
      }
  });

