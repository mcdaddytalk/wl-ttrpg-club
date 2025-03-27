import { SupabaseGameFavoriteListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type FavoritesParams = {
    id: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<FavoritesParams> }): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params; 
    const supabase = await createSupabaseServerClient();
    const { data: favoriteData, error: favoriteError } = await supabase
        .from('game_favorites')
        .select("*")
        .eq('member_id', id) as unknown as SupabaseGameFavoriteListResponse;

    if (favoriteError) {
        logger.error(favoriteError)
        return NextResponse.json({ message: favoriteError.message }, { status: 500 });
    }
  
    return NextResponse.json(favoriteData, { status: 200 })
}

export async function POST(request: NextRequest, { params }: { params: Promise<FavoritesParams> }) {
    const { id } = await params;

    const body = await request.json();
    const { game_id } = body;

    const supabase = await createSupabaseServerClient();

    const { data: favoriteData, error: favoriteError } = await supabase
        .from('game_favorites')
        .upsert({ game_id, member_id: id });

    if (favoriteError) {
        logger.error(favoriteError)
        return NextResponse.json({ message: favoriteError.message }, { status: 500 });
    }

    return NextResponse.json(favoriteData, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<FavoritesParams> }) {
    const { id } = await params;
    
    const body = await request.json();
    const { game_id } = body;

    const supabase = await createSupabaseServerClient();
    const { data: favoriteData, error: favoriteError } = await supabase
        .from('game_favorites')
        .delete()
        .eq('member_id', id)
        .eq('game_id', game_id);

    if (favoriteError) {
        logger.error(favoriteError)
        return NextResponse.json({ message: favoriteError.message }, { status: 500 });
    }

    return NextResponse.json(favoriteData, { status: 200 })
}