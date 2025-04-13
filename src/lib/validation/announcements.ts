import { z } from "zod";
import { StrictBooleanString } from "./parsers";



export const AnnouncementQuerySchema = z.object({
  title: z.string().optional(),
  audience: z.enum(['public', 'members', 'gamemasters', 'admins']).optional(),
  pinned: StrictBooleanString.optional(),
  published: StrictBooleanString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type AnnouncementQueryParams = z.infer<typeof AnnouncementQuerySchema>;