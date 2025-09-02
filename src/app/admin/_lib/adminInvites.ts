import { INVITE_STATUSES } from "@/lib/types/custom";
import { 
    parseAsArrayOf, 
    parseAsString,
    parseAsBoolean, 
    parseAsInteger, 
    createSearchParamsCache 
} from "nuqs/server";
import * as z from "zod";

export const InviteStatus = z.enum([...INVITE_STATUSES]);

export const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  status: parseAsArrayOf(InviteStatus).withDefault([]),
  game_id: parseAsString.withDefault(''),
  gm_id: parseAsString.withDefault(''),
  notified: parseAsBoolean.withDefault(false),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),
});

const InvitedPlayerSchema = z.object({
  displayName: z.string().min(1),
  given_name: z.string().min(1),
  surname: z.string().optional().default(""),
  email: z.email().optional(),
  phone: z.string().optional(),
  expires_in_days: z.number().int().min(1).max(60).optional(), // defaults server-side
});

export const createInvitesSchema = z.object({
  game_id: z.string().min(1),
  gamemaster_id: z.string().min(1),
  invitees: z.array(InvitedPlayerSchema).min(1),
});

export const updateInviteSchema = createInvitesSchema.partial();

export type GetInvitesSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;
export type CreateInviteSchema = z.infer<typeof createInvitesSchema>;
export type UpdateInviteSchema = z.infer<typeof updateInviteSchema>;
