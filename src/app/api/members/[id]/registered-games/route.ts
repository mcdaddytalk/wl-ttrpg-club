import { SupabaseGameRegistrationListResponse } from "@/lib/types/custom";
import { fetchGamesByUser } from "@/queries/fetchGames";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type MemberParams = {
    id: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<MemberParams> }): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: gameData, error: gameError } = await fetchGamesByUser(supabase, id) as unknown as SupabaseGameRegistrationListResponse;

    if (gameError) {
        console.error(gameError)
        return NextResponse.json({ message: gameError.message }, { status: 500 });
    }

    if (!gameData) {
        return NextResponse.json({ message: 'No games found' }, { status: 404 });
    }

    console.log('Registered Games Data:  ', gameData)

    return NextResponse.json(gameData, { status: 200 })

}