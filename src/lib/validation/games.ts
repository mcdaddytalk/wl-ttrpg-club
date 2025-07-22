import { z } from "zod";
import { DaysOfWeek, GAME_INTERVALS, GAME_STATUS, GAME_VISIBILITY } from "../types/custom";


const gameVisibility = z.enum([...GAME_VISIBILITY]).default("public");
const gameStatus = z.enum([...GAME_STATUS]).default("planning");
const gameInterval = z.enum([...GAME_INTERVALS]).default("weekly");
const dayOfWeekEnum = z.enum([...DaysOfWeek]).default("monday");

export const GameFilterSchema = z.object({
    search: z.string().optional(),
    visibility: gameVisibility.optional(),
})

export const CreateGameSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    system: z.string().min(1),
    visibility: gameVisibility,
    status: gameStatus,
    max_seats: z.number().int().min(1).max(20).default(5),
    starting_seats: z.number().int().min(1).max(20).default(0),
    interval: gameInterval,
    day_of_week: dayOfWeekEnum,
    first_game_date: z.string().datetime(),
    location_id: z.string()
  });

export type CreateGameFormValues = z.infer<typeof CreateGameSchema>