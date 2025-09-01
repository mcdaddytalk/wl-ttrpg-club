import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import z from "zod";
import { SessionNoteInsertSchema } from "@/lib/validation/sessionNotes";

const querySchema = z.object({
    game_id: z.uuid().optional(),
})

export async function GET(req: NextRequest): Promise<NextResponse> {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const supabase = await createSupabaseServerClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const parse = querySchema.safeParse({ game_id: searchParams.get("game_id") ?? undefined });
    if (!parse.success) {
        return NextResponse.json({ errors: parse.error.flatten() }, { status: 400 });
    }

    // Use the view so we get game_title and soft-delete filtering
  let q = supabase.from("session_notes_view").select("*").order("session_date", { ascending: false });

    if (parse.data.game_id) q = q.eq("game_id", parse.data.game_id);

    const { data, error } = await q;
    if (error) {
        logger.error("Error fetching session notes", error);
        return NextResponse.json({ message: "Failed to load notes" }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = SessionNoteInsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const payload = {
    ...parsed.data,
    author_id: auth.user.id,   // trust server
  };

  const { data, error } = await supabase.from("session_notes").insert(payload).select("*").single();

  if (error) {
    logger.error("Error creating session note", error);
    return NextResponse.json({ message: "Failed to create note" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
