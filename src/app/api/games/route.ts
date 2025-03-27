import { GameData, GameRegistration, SupabaseGameInviteListResponse, SupaGameScheduleData } from "@/lib/types/custom";
import { fetchFavorites } from "@/queries/fetchFavorites";
import { fetchRegistrants } from "@/queries/fetchRegistrants";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getInitialSession } from "@/server/authActions";



export async function GET( request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const session = await getInitialSession();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { user } = session;
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = await createSupabaseServerClient();
    const { data: gamesData, error: gamesError } = await supabase
      .from("game_schedule")
      .select(`
        id,
        game_id,
        status,
        interval,
        first_game_date,
        next_game_date,
        location_id,
        location:locations!game_schedule_location_id_fkey(
          *
        ),
        day_of_week,
        games (
          title,
          description,
          system,
          cover_image,
          max_seats,
          starting_seats,
          visibility,
          gamemaster_id,
          gamemaster:members!fk_games_members (
            id,
            profiles (
              given_name,
              surname,
              avatar
            )
          )
        )        
      `)
      .neq("status", "draft")
      .order("next_game_date", { ascending: true });

      if (gamesError) {
        logger.error(gamesError)
        return NextResponse.json({ message: gamesError.message }, { status: 500 });
    }

    // logger.info(`gamesData: ${JSON.stringify(gamesData)}`)
    // const gameIds = gamesData?.map((game) => game.id) ?? [];

    const { data: favoritesData, error: favoritesError } = await fetchFavorites(supabase);
    const favorites = (favoritesData)?.map((favorite) => {
      return {
          game_id: favorite.game_id,
          member_id: favorite.member_id,
          created_at: new Date(favorite.created_at)
      }
    }) ?? [];

    if (favoritesError) {
        logger.error(favoritesError)
        return NextResponse.json({ message: favoritesError.message }, { status: 500 });
    }

    const { data: invitesData, error: invitesError } = await supabase
      .from('game_invites')
      .select('*')
      .order('expires_at', { ascending: true }) as unknown as SupabaseGameInviteListResponse;

    const { data: registrationData, error: registrationsError } = await fetchRegistrants(supabase);
    const registrations = registrationData ? registrationData as GameRegistration[] : [];
    
    if (invitesError) throw invitesError
    if (registrationsError) throw registrationsError
    if (!registrations) throw new Error("Registrations not found")

    const seatCounts = registrations.filter((reg) => {
      return reg.game_id !== null && reg.member_id !== null && reg.status === "approved"
    }).reduce((acc, reg) => {
      const game = gamesData?.find((game) => game.game_id === reg.game_id);
        if (game) {
          acc[reg.game_id] = (acc[reg.game_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    const scheduledGames: GameData[] = (gamesData as unknown as SupaGameScheduleData[])
    .filter((gameSchedule) => 
      gameSchedule.games.visibility == 'public' 
      || (gameSchedule.games.visibility == 'private' && gameSchedule.games.gamemaster_id === user.id)
      ||  registrations?.some((reg) => reg.game_id === gameSchedule.game_id && reg.member_id === user.id)
      ||  invitesData?.some((invite) => invite.game_id === gameSchedule.game_id && invite.invitee === user.id)
    )
    .map((gameSchedule) => {
      return {
        id: gameSchedule.id,
        game_id: gameSchedule.game_id,
        status: gameSchedule.status,
        interval: gameSchedule.interval,
        firstGameDate: gameSchedule.first_game_date,
        nextGameDate: gameSchedule.next_game_date,
        location_id: gameSchedule.location_id,
        location: gameSchedule.location,
        dayOfWeek: gameSchedule.day_of_week,
        title: gameSchedule.games.title,
        description: gameSchedule.games.description,
        system: gameSchedule.games.system,
        coverImage: gameSchedule.games.cover_image,
        maxSeats: gameSchedule.games.max_seats,
        visibility: gameSchedule.games.visibility,
        startingSeats: gameSchedule.games.starting_seats,
        currentSeats: seatCounts![gameSchedule.game_id] || 0,
        favorite: false,
        registered: false,
        pending: false,
        favoritedBy: favorites.filter((favorite) => favorite.game_id === gameSchedule.game_id),
        registrations: registrations.filter((reg) => reg.game_id === gameSchedule.game_id),
        gamemaster_id: gameSchedule.games.gamemaster_id,
        gm_given_name: gameSchedule.games.gamemaster.profiles.given_name ?? "",
        gm_surname: gameSchedule.games.gamemaster.profiles.surname ?? "",
      }
    })
    
    return NextResponse.json(scheduledGames, { status: 200 });
}