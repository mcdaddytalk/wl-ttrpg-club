import { logAuditEvent } from "@/server/auditTrail";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface InviteParams {
    id: string;
    member_id: string;
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<InviteParams> }
  ): Promise<NextResponse> {
    if (request.method !== "PATCH") {
      return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const { id, member_id } = await params;

    const { data: actingMember } = await supabase
      .from("members")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
  
    if (!actingMember) {
      return NextResponse.json({ message: "Member not found" }, { status: 403 });
    }
  
    const body = await request.json();
    const schema = z.object({
      status: z.enum(["rejected", "banned"]),
      status_note: z.string().min(1),
    });
  
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.format() }, { status: 400 });
    }
  
    const { status, status_note } = result.data;
  
    const { error } = await supabase
      .from("game_registrations")
      .update({
        status,
        status_note,
        updated_by: actingMember.id,
      })
      .eq("game_id", id)
      .eq("member_id", member_id);
  
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  
    await logAuditEvent({
      action: "update",
      actor_id: user.id,
      target_type: "game_registrations",
      target_id: id,
      summary: "Player status updated",
      metadata: {
        game_id: id,
        member_id: member_id,
        status,
        status_note,
      },
    });
  
    return NextResponse.json({ message: "Player status updated" }, { status: 200 });
  }
  