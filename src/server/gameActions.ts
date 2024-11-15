"use server"

import { GameSchedule, SupabaseGameScheduleData, SupaGameRegistrationData, SupaGameSchedule } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGame(game: unknown) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("games").insert(game);
    if (error) throw new Error(error.message);
    revalidatePath("/member/dashboard");
}

export const fetchSchedulesForGM = async (gmId: string): Promise<GameSchedule[] | []> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
    .from('game_schedule')
    .select(`
        id, 
        game_id, 
        interval, 
        day_of_week, 
        first_game_date,
        next_game_date, 
        last_game_date, 
        status,
        games (name),
        game_registrations (member_id, profiles (given_name, surname))
    `)
    .eq('gm_id', gmId);    
    
    if (error) {
        console.error(error)
        return [];
    }
    const formatttedData: GameSchedule[] = (data as unknown as SupabaseGameScheduleData[]).map((gameSchedule) => {
        return {
            id: gameSchedule.id,
            game_id: gameSchedule.game_id,
            interval: gameSchedule.interval,
            day_of_week: gameSchedule.day_of_week,
            first_game_date: gameSchedule.first_game_date,
            next_game_date: gameSchedule.next_game_date,
            last_game_date: gameSchedule.last_game_date,
            status: gameSchedule.status,
            game_name: gameSchedule.games[0].name,
            game_registrations: gameSchedule.game_registrations.map((gameRegistration: SupaGameRegistrationData) => {
                return {
                    member_id: gameRegistration.member_id,
                    given_name: gameRegistration.profiles[0].given_name,
                    surname: gameRegistration.profiles[0].surname,
                }
            })
        }    
    })
    return formatttedData;
}

export const createSchedule = async (schedule: SupaGameSchedule): Promise<void> => {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("game_schedule").insert(schedule);
    if (error) throw new Error(error.message);
    revalidatePath("/gamemaster/dashboard");
}

export async function deleteGame(gameId: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("games").delete().eq("id", gameId);
    if (error) throw new Error(error.message);
    revalidatePath("/member/dashboard");
}

export async function updateGame(gameId: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("games").update({ updated_at: new Date() }).eq("id", gameId);
    if (error) throw new Error(error.message);
    revalidatePath("/member/dashboard");
}

export async function updateGameStatus(gameId: string, status: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("games").update({ status }).eq("id", gameId);
    if (error) throw new Error(error.message);
    revalidatePath("/member/dashboard");
}

