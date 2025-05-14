import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import { GetInvitesSchema } from "@/app/admin/_lib/adminInvites";
import { SupabaseGameInviteListResponse } from "@/lib/types/custom";

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json() as GetInvitesSchema;

    const {
        page,
        pageSize,
        search,
        status,
        game_id,
        gm_id,
        notified,
        from,
        to,
    } = body;

    const offset = (page - 1) * pageSize;
    const now = new Date().toISOString();
    
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from("game_invites")
        .select(
            `
                *,
                games (title),
                gamemaster: members!game_invites_gamemaster_id_fkey(
                    email,
                    profiles (
                        given_name,
                        surname
                    )
                )                
            `, { count: "exact" }
        )
        .order("invited_at", { ascending: false })
        .range(offset, offset + pageSize - 1);
    
        if (search) {
            query = query.or(`display_name.ilike.%${search}%,external_email.ilike.%${search}%`);
          }
        
          if (game_id) {
            query = query.eq("game_id", game_id);
          }
        
          if (gm_id) {
            query = query.eq("gamemaster_id", gm_id);
          }
        
          if (notified !== undefined) {
            query = query.eq("notified", notified);
          }
        
          if (from) {
            query = query.gte("invited_at", from);
          }
        
          if (to) {
            query = query.lte("invited_at", to);
          }
        
          // Derived status logic
          if (status.length > 0) {
            const conditions: string[] = [];
        
            if (status.includes("accepted")) {
              conditions.push("accepted.eq.true");
            }
        
            if (status.includes("pending")) {
              conditions.push(`and(accepted.eq.false,expires_at.gt.${now})`);
            }
        
            if (status.includes("expired")) {
              conditions.push(`and(accepted.eq.false,expires_at.lte.${now})`);
            }
        
            query = query.or(conditions.join(","));
          }
        
          const { data, count, error } = await query as unknown as SupabaseGameInviteListResponse;
        
          if (error) {
            logger.error(error);
            return NextResponse.json({ message: "Error fetching invites" }, { status: 500 });
          }
        
          const results = data.map((invite) => ({
            id: invite.id,
            display_name: invite.display_name,
            email: invite.external_email,
            invited_at: invite.invited_at,
            expires_at: invite.expires_at,
            accepted: invite.accepted,
            notified: invite.notified,
            game_title: invite.games.title ?? "—",
            gm_name: invite.gamemaster
              ? `${invite.gamemaster.profiles.given_name} ${invite.gamemaster.profiles.surname}`.trim()
              : "—",
          }));
        
          const pageCount = Math.ceil((count ?? 0) / pageSize);
        
          return NextResponse.json({
            results,
            count: count ?? 0,
            pageCount,
          });
}