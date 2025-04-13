import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import { GMAnalytics, RegistrationStatus } from "@/lib/types/custom";

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
  
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const gmId = user.id;

    // Get all GM games
    const { data: gmGames, error: gamesError } = await supabase
        .from("games")
        .select("id, title")
        .eq("gamemaster_id", gmId)
        .is("deleted_at", null);

    if (gamesError || !gmGames) {
        logger.error("Failed to fetch GM games", gamesError);
        return NextResponse.json({ message: "Failed to fetch GM games" }, { status: 500 });
    }

    const gmGameIds = gmGames.map((g) => g.id);

    // Total games and active games
    const totalGames = gmGameIds.length;
    const { count: activeGames = 0 } = await supabase
        .from("games")
        .select("*", { count: "exact", head: true })
        .eq("gamemaster_id", gmId)
        .eq("status", "active")
        .is("deleted_at", null);

    // Upcoming scheduled sessions
    let upcomingSessions = 0;
    if (gmGameIds.length > 0) {
        const { count, error: scheduleError } = await supabase
        .from("game_schedule")
        .select("*", { count: "exact", head: true })
        .in("game_id", gmGameIds)
        .gt("next_game_date", new Date().toISOString())
        .is("deleted_at", null);

        if (scheduleError) {
        logger.error("Failed to fetch upcoming sessions", scheduleError);
        }

        upcomingSessions = count || 0;
    }

    // Total unique players
    const { data: registrations, error: regError } = await supabase
        .from("game_registrations")
        .select("member_id, game_id, status")
        .in("game_id", gmGameIds);

    if (regError) {
        logger.error("Failed to fetch registrations", regError);
        return NextResponse.json({ message: "Failed to fetch registrations" }, { status: 500 });
    }

    const uniquePlayerIds = new Set(registrations?.map((r) => r.member_id));
    const totalPlayers = uniquePlayerIds.size;

    // Registration status breakdown
    const registrationStatus: RegistrationStatus = {
        approved: 0,
        pending: 0,
        rejected: 0,
        banned: 0,
    };
    registrations?.forEach(({ status }) => {
        if (status in registrationStatus) {
            registrationStatus[status as keyof RegistrationStatus]++;
        }
    });

    // Invite acceptance stats
    const { data: invites, error: inviteError } = await supabase
        .from("game_invites")
        .select("game_id, accepted")
        .in("game_id", gmGameIds);

    if (inviteError) {
        logger.error("Failed to fetch invites", inviteError);
        return NextResponse.json({ message: "Failed to fetch invites" }, { status: 500 });
    }
    
    const inviteStatsMap = new Map();
    invites?.forEach((invite) => {
        const gameId = invite.game_id;
        if (!inviteStatsMap.has(gameId)) {
        inviteStatsMap.set(gameId, { accepted: 0, total: 0 });
        }
        const stat = inviteStatsMap.get(gameId);
        stat.total += 1;
        if (invite.accepted) stat.accepted += 1;
    });

    const inviteStats = [...inviteStatsMap.entries()].map(([gameId, stats]) => {
        const gameTitle = gmGames.find((g) => g.id === gameId)?.title || "Untitled";
        return {
        gameId,
        gameTitle,
        ...stats,
        };
    });

    const payload: GMAnalytics = {
        totalGames,
        activeGames: activeGames ?? 0,
        upcomingSessions,
        totalPlayers,
        registrationStatus,
        inviteStats,
    };

    return NextResponse.json(payload);
}
