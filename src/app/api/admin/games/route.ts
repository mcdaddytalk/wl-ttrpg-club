import { NextResponse, NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import logger from '@/utils/logger';
import { SupabaseGMGameDataListResponse } from '@/lib/types/custom';

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: gamesData, error: gamesError } = await supabase
      .from("games")
      .select(`
            id,
            title,
            gm_id,
            gamemaster: members!fk_games_members (
                email,
                profiles (
                    given_name,
                    surname,
                    avatar
                )
            )
    `)
      .order('created_at', { ascending: false }) as unknown as SupabaseGMGameDataListResponse;

    if (gamesError) {
        logger.error(gamesError);
        return NextResponse.json({ message: 'Error fetching games' }, { status: 500 });
    }

    return NextResponse.json(gamesData);
}