import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
  isMinor: z.boolean(),

  parentFirstName: z.string().optional(),
  parentSurname: z.string().optional(),
  parentEmail: z.string().email().optional(),
  parentPhone: z.string().optional(),

  experienceLevel: z.string().min(1),
  gamemasterInterest: z.string().min(1),
  preferredSystem: z.string().min(1),
  availability: z.string().min(1),
  agreeToRules: z.boolean()
});

export type ContactFormData = z.infer<typeof contactSchema>;
