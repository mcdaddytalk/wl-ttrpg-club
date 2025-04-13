import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SessionNoteSchema } from "@/lib/validation/sessionNotes";
import logger from "@/utils/logger";

export async function POST(req: NextRequest): Promise<NextResponse> {
    if (req.method !== "POST") {
      return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
  
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = SessionNoteSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ errors: result.error.flatten() }, { status: 400 });
    }

    const note = result.data;

    const { error: insertError } = await supabase
        .from("session_notes")
        .insert({
            ...note,
            game_id: body.game_id,
            author_id: user.id,
        });

    if (insertError) {
        logger.error("Error creating session note", insertError);
        return NextResponse.json({ message: "Failed to create note" }, { status: 500 });
    }

    return NextResponse.json({ message: "Note created" }, { status: 201 });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data, error: notesError } = await supabase
        .from("session_notes")
        .select("*")
        .eq("author_id", user.id)
        .order("session_date", { ascending: false });

    if (notesError) {
        logger.error("Error fetching session notes", notesError);
        return NextResponse.json({ message: "Failed to load notes" }, { status: 500 });
    }

    return NextResponse.json(data);
}
