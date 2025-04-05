import { experienceLevels, MemberData } from "@/lib/types/custom"
import {
    createSearchParamsCache,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
  } from "nuqs/server"
  import * as z from "zod"
  
  import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers"
    
  export const searchParamsCache = createSearchParamsCache({
    flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
      []
    ),
    search: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<MemberData>().withDefault([
      { id: "created_at", desc: true },
      // { id: "surname", desc: true },
      // { id: "given_name", desc: true },
      { id: "email", desc: false },
      { id: "is_admin", desc: false },
      { id: "is_minor", desc: false },
      // { id: "experience_level", desc: false },
    ]),
    email: parseAsString.withDefault(""),
    experienceLevel: parseAsArrayOf(z.enum(experienceLevels)).withDefault([]),
    // Optional boolean filters as strings ("true" / "false")
    isAdmin: parseAsStringEnum(["true", "false"]),
    isMinor: parseAsStringEnum(["true", "false"]),
    from: parseAsString.withDefault(""),
    to: parseAsString.withDefault(""),
    // advanced filter
    filters: getFiltersStateParser().withDefault([]),
    joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  })
  
  export const createMemberSchema = z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    provider: z.string().optional(),
    is_admin: z.boolean(),
    is_minor: z.boolean(),
    profiles: z.object({
        given_name: z.string(),
        surname: z.string(),
        birthday: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        experience_level: z.enum(experienceLevels)
    })
  })
  
  export const updateMemberSchema = createMemberSchema.partial();
  
  export type GetMembersSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
  export type CreateMemberSchema = z.infer<typeof createMemberSchema>
  export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>