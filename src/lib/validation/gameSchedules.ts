import { z } from "zod";
import { DaysOfWeek, GAME_INTERVALS, GAME_SCHED_STATUS } from "../types/custom";

const GameIntervalEnum = z.enum([...GAME_INTERVALS])
const GameStatusEnum = z.enum([...GAME_SCHED_STATUS])
const DayOfWeekEnum = z.enum([...DaysOfWeek])

export const GMGameScheduleSchema = z.object({
    interval: GameIntervalEnum,
    status: GameStatusEnum,
    location_id: z.string().uuid().optional(),
    first_game_date: z.string().datetime(),
    next_game_date: z.string().datetime().optional(),
    last_game_date: z.string().datetime().nullable().optional(),
    day_of_week: DayOfWeekEnum.optional(),
  });