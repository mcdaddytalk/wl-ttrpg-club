import { RESOURCE_CATEGORIES, RESOURCE_VISIBILITY } from "@/lib/types/custom";
import { StrictBooleanString } from "@/lib/validation/parsers";
import { z } from "zod";

export const GameResourceCategories = z.enum([...RESOURCE_CATEGORIES]);
export const GameResourceVisibility = z.enum([...RESOURCE_VISIBILITY]);

export const CreateGameResourceSchema = z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    body: z.string().min(1),
    category: GameResourceCategories,
    visibility: GameResourceVisibility,
    pinned: StrictBooleanString,
    external_url: z.string().url().optional(),
    file_url: z.string().url().optional()
});

export const UpdateGameResourceSchema = CreateGameResourceSchema.partial();
