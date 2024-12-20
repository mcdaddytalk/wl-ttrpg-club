import { GameData, GameRegistration, SupaGameScheduleData } from "@/lib/types/custom";
import { fetchFavorites } from "@/queries/fetchFavorites";
import { fetchRegistrants } from "@/queries/fetchRegistrants";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";



export async function GET( request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
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
        location,
        day_of_week,
        games (
          title,
          description,
          system,
          image,
          max_seats,
          starting_seats,
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
        console.error(gamesError)
        return NextResponse.json({ message: gamesError.message }, { status: 500 });
    }
    
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
        console.error(favoritesError)
        return NextResponse.json({ message: favoritesError.message }, { status: 500 });
    }

    const { data: registrationData, error: registrationsError } = await fetchRegistrants(supabase);
    const registrations = registrationData ? registrationData as GameRegistration[] : [];
    
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

    const scheduledGames: GameData[] = (gamesData as unknown as SupaGameScheduleData[]).map((gameSchedule) => {
      return {
        id: gameSchedule.id,
        game_id: gameSchedule.game_id,
        status: gameSchedule.status,
        interval: gameSchedule.interval,
        firstGameDate: gameSchedule.first_game_date,
        nextGameDate: gameSchedule.next_game_date,
        location: gameSchedule.location,
        dayOfWeek: gameSchedule.day_of_week,
        title: gameSchedule.games.title,
        description: gameSchedule.games.description,
        system: gameSchedule.games.system,
        image: gameSchedule.games.image,
        maxSeats: gameSchedule.games.max_seats,
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