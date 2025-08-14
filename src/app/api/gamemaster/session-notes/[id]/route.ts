import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import { SessionNoteUpdateSchema } from "@/lib/validation/sessionNotes";

interface Params {
    id: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
  if (req.method !== "PATCH") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = SessionNoteUpdateSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });

  // Rely on RLS: author, assigned GM of the game, global gamemaster role, or admin may update
  const { data, error } = await supabase.from("session_notes").update(parsed.data).eq("id", id).select("*").single();

  if (error) {
    logger.error("Failed to update session note", error);
    return NextResponse.json({ message: "Failed to update note" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
  if (req.method !== "DELETE") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Soft delete; rely on RLS for authorization
  const { data, error } = await supabase.from("session_notes").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("*").single();

  if (error) {
    logger.error("Failed to soft-delete session note", error);
    return NextResponse.json({ message: "Failed to delete note" }, { status: 500 });
  }

  return NextResponse.json(data);
}