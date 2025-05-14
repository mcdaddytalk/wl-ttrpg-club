import { z } from "zod"

export const profileSchema = z.object({
    given_name: z.string().min(1, "Required"),
    surname: z.string().min(1, "Required"),
    phone: z.string().optional(),
    birthday: z.string().optional(),
    experience_level: z.enum([
      "new", "novice", "seasoned", "player-gm", "forever-gm"
    ]).optional(),
    bio: z.string().optional(),
    avatar: z.string().optional()
})
  
export type ProfileFormValues = z.infer<typeof profileSchema>
  