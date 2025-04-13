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

export const createInvitesSchema = z.object({
    game_id: z.string(),
    invitee: z.string(),
    external_email: z.string().optional(),
    external_phone: z.string().optional(),
    expires_at: z.string(),
    gamemaster_id: z.string(),
})

export const updateInviteSchema = createInvitesSchema.partial();

export type GetInvitesSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;
export type CreateInviteSchema = z.infer<typeof createInvitesSchema>;
export type UpdateInviteSchema = z.infer<typeof updateInviteSchema>;
