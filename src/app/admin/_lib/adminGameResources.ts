import { RESOURCE_CATEGORIES, RESOURCE_TYPES, RESOURCE_VISIBILITY } from "@/lib/types/custom";
import { StrictBooleanString } from "@/lib/validation/parsers";
import { z } from "zod";

export const GameResourceCategories = z.enum([...RESOURCE_CATEGORIES]);
export const GameResourceVisibility = z.enum([...RESOURCE_VISIBILITY]);
export const GameResourceType = z.enum([...RESOURCE_TYPES]);

export const CreateGameResourceSchema = z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    body: z.string().min(1),
    category: GameResourceCategories,
    visibility: GameResourceVisibility,
    pinned: StrictBooleanString,
    external_url: z.string().url().optional(),
    file_url: z.string().url().optional(),
    created_by: z.string(), 
    game_id: z.string(),      
    resource_type: GameResourceType,
    storage_path: z.string().optional(),
});

export const UpdateGameResourceSchema = CreateGameResourceSchema.partial();
