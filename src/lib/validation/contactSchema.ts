import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
  isMinor: z.boolean(),

  parentFirstName: z.string().optional(),
  parentSurname: z.string().optional(),
  parentEmail: z.string().optional().or(z.literal('')),
  parentPhone: z.string().optional().or(z.literal('')),

  experienceLevel: z.string().min(1),
  gamemasterInterest: z.string().min(1),
  preferredSystem: z.string().min(1),
  availability: z.string().min(1),
  agreeToRules: z.boolean()
}).superRefine((data, ctx) => {
  if (data.isMinor) {
    if (!data.parentEmail || !data.parentEmail.includes('@')) {
      ctx.addIssue({
        path: ['parentEmail'],
        code: 'custom',
        message: 'Parent email is required for minors and must be valid.'
      });
    }
  }
});

export type ContactFormData = z.infer<typeof contactSchema>;
