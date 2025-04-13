import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SessionNoteSchema } from "@/lib/validation/sessionNotes";
import logger from "@/utils/logger";

interface Params {
    id: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    if (req.method !== "PATCH") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    
    const { id } = await params;
    const body = await req.json();
    
    const supabase = await createSupabaseServerClient();
  
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
  
    if (error || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const result = SessionNoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten() }, { status: 400 });
    }
  
    const { error: updateError } = await supabase
      .from("session_notes")
      .update({ ...result.data })
      .eq("id", id)
      .eq("author_id", user.id);
  
    if (updateError) {
      logger.error("Failed to update session note", updateError);
      return NextResponse.json({ message: "Failed to update note" }, { status: 500 });
    }
  
    return NextResponse.json({ message: "Note updated" });
  }

export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    if (req.method !== "DELETE") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
  
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
  
    if (error || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const { error: deleteError } = await supabase
      .from("session_notes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("author_id", user.id);
  
    if (deleteError) {
      logger.error("Failed to soft-delete session note", deleteError);
      return NextResponse.json({ message: "Failed to delete note" }, { status: 500 });
    }
  
    return NextResponse.json({ message: "Note deleted" });
  }