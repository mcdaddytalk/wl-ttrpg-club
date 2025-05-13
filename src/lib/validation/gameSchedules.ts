import { z } from "zod";
import { DaysOfWeek, GAME_INTERVALS, GAME_SCHED_STATUS } from "../types/custom";

const GameIntervalEnum = z.enum([...GAME_INTERVALS])
const GameStatusEnum = z.enum([...GAME_SCHED_STATUS])
const DayOfWeekEnum = z.enum([...DaysOfWeek])

export const GMGameScheduleSchema = z.object({
    interval: GameIntervalEnum.optional(),
    status: GameStatusEnum.optional(),
    location_id: z.string().uuid().optional(),
    first_game_date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date",
    }).optional(),
    next_game_date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date",
    }).optional(),
    last_game_date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date",
    }).nullable().optional(),
    day_of_week: DayOfWeekEnum.optional(),
});

export type ScheduleUpdateInput = z.infer<typeof GMGameScheduleSchema>