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

    const { body } = await request.json();
    const { archived } = body;

    const { id } = await params;

    const supabase = await createSupabaseServerClient();
    const { data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: gameData, error: gameError } = await supabase
        .from("games")
        .update({
            deleted_at: archived ? new Date().toISOString() : null,
            updated_by: user.id,
        })
        .eq("id", id)
        .select()
        .single();

    if (gameError) {
        logger.error(gameError);
        return NextResponse.json({ message: "Error archiving game" }, { status: 500 });
    }

    if (!gameData) {
        return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Game archived successfully" }, { status: 200 });
}