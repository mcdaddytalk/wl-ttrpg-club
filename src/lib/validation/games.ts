import { z } from "zod";
import { GAME_STATUS, GAME_VISIBILITY } from "../types/custom";


const gameVisibility = z.enum([...GAME_VISIBILITY]).default("public");
const gameStatus = z.enum([...GAME_STATUS]).default("planning");

export const GameFilterSchema = z.object({
    search: z.string().optional(),
    visibility: gameVisibility.optional(),
})

export const CreateGameSchema = z.object({
    title: z.string(),
    description: z.string().min(1),
    system: z.string().min(1),
    max_seats: z.number().int().min(1),
    starting_seats: z.number().int().default(0),
    visibility: gameVisibility,
    status: gameStatus,
  });