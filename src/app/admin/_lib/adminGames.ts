import { getSortingStateParser } from "@/lib/parsers";
import { GAME_SCHED_STATUS, GMGameData } from "@/lib/types/custom";
import { 
    parseAsArrayOf, 
    parseAsString, 
//    parseAsStringEnum, 
    parseAsBoolean, 
    parseAsInteger, 
    createSearchParamsCache 
} from "nuqs/server";
import * as z from "zod";

export const GameSchedStatus = z.enum([...GAME_SCHED_STATUS]);
export const gameSystems = z.enum(["D&D 5e", "Pathfinder 2e", "Call of Cthulhu", "Savage Worlds", "Other"]); // or dynamic later

export const adminGameSearchParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<GMGameData>().withDefault([
    { id: "created_at", desc: true },
    { id: "title", desc: true },
  ]),
  system: parseAsArrayOf(gameSystems).withDefault([]),
  status: parseAsArrayOf(GameSchedStatus).withDefault([]),
  archived: parseAsBoolean.withDefault(false),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),
};

export const searchGamesParamsCache = createSearchParamsCache(adminGameSearchParams);

export type GetGamesSchema = Awaited<ReturnType<typeof searchGamesParamsCache.parse>>;
