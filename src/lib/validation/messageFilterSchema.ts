import { z } from "zod"

export const MessageFilterSchema = z.object({
  read: z.enum(["read", "unread", "all"]).default("all"),
  category: z.string().optional(),
  sender_id: z.uuid().optional(),
})

export type MessageFilterInput = z.input<typeof MessageFilterSchema>
export type MessageFilterOutput = z.output<typeof MessageFilterSchema>