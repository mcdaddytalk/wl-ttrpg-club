import { z } from "zod";

export const SessionNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  session_date: z.string().datetime("Invalid session date"),
  body: z.string().min(1, "Content is required"),
  is_visible_to_players: z.boolean().optional().default(false),
});

export type SessionNoteFormValues = z.infer<typeof SessionNoteSchema>;
