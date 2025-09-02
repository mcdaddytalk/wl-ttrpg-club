import { z } from "zod";
import { RESOURCE_CATEGORIES, RESOURCE_VISIBILITY } from "@/lib/types/custom";

export const GameResourceFilterSchema = z.object({
  search: z.string().optional(),
  category: z.enum([...RESOURCE_CATEGORIES]).optional(),
  pinned: z.coerce.boolean().optional(),
  visibility: z.enum([...RESOURCE_VISIBILITY]).optional(),
  game_id: z.uuid().optional()
});

export type GameResourceFilterParams = z.infer<typeof GameResourceFilterSchema>;