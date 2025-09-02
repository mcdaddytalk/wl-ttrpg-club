import { db } from '@/utils/drizzle';
import { createClient } from '@supabase/supabase-js';
import { GameData } from '@/lib/types/custom';
import { games } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { SERVER_ENVS as ENVS } from "@/utils/constants/envs"

const supabase = createClient(ENVS.NEXT_PUBLIC_SUPABASE_URL!, ENVS.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const Database = {
    getUserProfile: async (id: string) => {
        return await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
    },
    createGame: async (game: GameData) => {
        return await db.insert(games).values(game).returning();
    },
    updateGame: async (game: GameData) => {
        return await db.update(games).set(game).where(eq(games.id, game.id)).returning();
    },
    deleteGame: async (id: string) => {
        return await db.delete(games).where(eq(games.id, id)).returning();
    },
    getGame: async (id: string) => {
        return await db.select().from(games).where(eq(games.id, id));
    },
    getGames: async () => {
        return await db.select().from(games);
    },
    getGamesPaginated: async (page = 1, limit = 5) => {
        return await db.select().from(games).limit(limit).offset((page - 1) * limit);
    },
    subscribeToRealtimeChanges: async (tableName: string, callback: (...args: unknown[]) => void) => {
        if (!tableName || !callback) 
            return
        supabase
            .channel(tableName)
            .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, callback)
            .subscribe();
    }
}