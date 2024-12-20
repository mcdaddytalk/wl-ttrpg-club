import { GameData, GameFavorite, GameRegistration, SupabaseGameDataResponse } from "@/lib/types/custom";
import { fetchFavorites } from "@/queries/fetchFavorites";
import { fetchRegistrants } from "@/queries/fetchRegistrants";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type GameParams = {
    game_id: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<GameParams> }): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { game_id } = await params;
    
    const supabase = await createSupabaseServerClient();
    const { data: gameData, error: gameError } = await supabase
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
      .eq("game_id", game_id)
      .order("next_game_date", { ascending: true })
      .maybeSingle() as unknown as SupabaseGameDataResponse;

    if (gameError) {
        console.error(gameError)
        return NextResponse.json({ message: gameError.message }, { status: 500 });
    }

    const { data: favoritesData, error: favoritesError } = await fetchFavorites(supabase);
    const favorites: GameFavorite[] = (favoritesData)?.map((favorite) => {
        return {
            game_id: favorite.game_id,
            member_id: favorite.member_id,
            created_at: new Date(favorite.created_at)
        }
    }) ?? [];

    if (favoritesError) throw favoritesError

    const { data: registrationData, error: registrationsError } = await fetchRegistrants(supabase);
    const registrations = registrationData ? registrationData as GameRegistration[] : [];
    
    if (registrationsError) throw registrationsError
    if (!registrations) throw new Error("Registrations not found")

    const seatCounts = registrations.filter((reg) => {
      return reg.game_id !== null && reg.member_id !== null && reg.status === "approved"
    }).filter((reg) => reg.game_id === gameData.game_id).length
    
    const game: GameData = {
        id: gameData.id,
        game_id: gameData.game_id,
        status: gameData.status,
        interval: gameData.interval,
        firstGameDate: gameData.first_game_date,
        nextGameDate: gameData.next_game_date,
        location: gameData.location,
        dayOfWeek: gameData.day_of_week,
        title: gameData.games.title,
        description: gameData.games.description,
        system: gameData.games.system,
        image: gameData.games.image,
        maxSeats: gameData.games.max_seats,
        currentSeats: seatCounts || 0,
        startingSeats: gameData.games.starting_seats,
        favorite: false,
        registered: false,
        pending: false,
        favoritedBy: favorites.filter((favorite) => favorite.game_id === gameData.game_id),
        registrations: registrations.filter((reg) => reg.game_id === gameData.game_id),
        gamemaster_id: gameData.games.gamemaster_id,
        gm_given_name: gameData.games.gamemaster.profiles.given_name ?? "",
        gm_surname: gameData.games.gamemaster.profiles.surname ?? "",
    };

    return NextResponse.json(game, { status: 200 });
}