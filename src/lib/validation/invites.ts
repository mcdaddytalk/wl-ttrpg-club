import { z } from "zod";

export const ExternalInviteeSchema = z.object({
  given_name: z.string().min(1, "Required"),
  surname: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  expires_in_days: z.string().regex(/^\d+$/, "Must be a number"),
});

export const InviteFormSchema = z.object({
  game_id: z.string().uuid({ message: "Game is required" }),
  internal_invitees: z.array(z.string().email()).optional(),
  external_invitees: z.array(ExternalInviteeSchema).optional(),
});

export type InviteFormValues = z.infer<typeof InviteFormSchema>;
