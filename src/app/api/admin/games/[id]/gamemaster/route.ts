import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";

interface Params {
    id: string;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }) {
    if (request.method !== "PATCH") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const { id } = await params;
    const { newGMId } = await request.json();
    
    logger.debug(`PATCH /api/admin/games/${id}/gamemaster`, { newGMId });
    
    if (!newGMId) {
        return NextResponse.json({ message: "Missing new GM ID" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }    

    const { data: gameData, error: gameError } = await supabase
        .from("games")
        .update({ gamemaster_id: newGMId, updated_by: user.id })
        .eq("id", id)
        .select()
        .single();

    if (gameError) {
        logger.error(gameError);
        return NextResponse.json({ message: "Error updating game" }, { status: 500 });
    }    

    if (!gameData) {    
        return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Game updated successfully" }, { status: 200 });
}