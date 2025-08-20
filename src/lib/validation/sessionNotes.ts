import { z } from "zod";

const ScheduleId = z
  .union([z.string().uuid(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v && typeof v === "string" && v.length > 0 ? v : null));

export const SessionNoteInsertSchema = z.object({
  game_id: z.string().uuid({ message: "Game is required" }),
  schedule_id: ScheduleId,                           // optional -> null
  title: z.string().min(1, "Title is required"),
  // Coerce various inputs (Date/string) to ISO string for timestamptz
  session_date: z.coerce
    .date()
    .transform((d) => d.toISOString()),
  body: z.string().min(1, "Content is required"),
  is_visible_to_players: z.boolean().default(false),
});

// For PATCH (partial updates)
export const SessionNoteUpdateSchema = SessionNoteInsertSchema.partial();

export const SessionNoteFormSchema = z.object({
  game_id: z.string().uuid({ message: "Game is required" }),
  schedule_id: ScheduleId,
  title: z.string().min(1, "Title is required"),
  // datetime-local wants "YYYY-MM-DDTHH:mm", keep it a string on the client
  session_date: z.string().min(1, "Session date is required"),
  body: z.string().min(1, "Content is required"),
  is_visible_to_players: z.boolean().default(false),
});

// Types you’ll use on the client (form) vs server (payload)
export type SessionNoteFormValues = z.infer<typeof SessionNoteFormSchema>;
export type SessionNoteInsert = z.output<typeof SessionNoteInsertSchema>;
export type SessionNoteUpdate = z.output<typeof SessionNoteUpdateSchema>;
