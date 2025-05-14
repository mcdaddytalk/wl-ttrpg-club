import { GMGameScheduleSchema } from "@/lib/validation/gameSchedules";
import { logAuditEvent } from "@/server/auditTrail";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> } ): Promise<NextResponse> {
    if (request.method !== 'PATCH') {
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
  
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json() 
 
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq('id', user.id)
      .single();

    if (!member) {
      return NextResponse.json({ message: "Member not found" }, { status: 403 });
    }

    const result = GMGameScheduleSchema.partial().safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.format() },
        { status: 400 }
      );
    }

    const { data: existingSchedule } = await supabase
      .from("game_schedule")
      .select("id")
      .eq("game_id", id)
      .maybeSingle();

    const payload = {
      ...result.data,
      first_game_date: result.data.first_game_date ?? result.data.next_game_date ?? new Date().toISOString(),
      next_game_date: result.data.next_game_date ?? null,
      last_game_date: result.data.last_game_date ?? null,
      interval: result.data.interval ?? "weekly",
    }

    let updated;
    if (existingSchedule) {
      const { data, error } = await supabase
        .from("game_schedule")
        .update(payload)
        .eq("game_id", id)
        .select("*")
        .single();

      if (error) return NextResponse.json({ message: error.message }, { status: 500 });
      updated = data;
    } else {
      const { data, error } = await supabase
        .from("game_schedule")
        .insert(payload)
        .select("*")
        .single();

      if (error) return NextResponse.json({ message: error.message }, { status: 500 });
      updated = data;
    }

    await logAuditEvent({
      action: existingSchedule ? "update" : "create",
      actor_id: member.id,
      target_type: "game_schedule",
      target_id: id,
      summary: "Game schedule updated",
      metadata: payload,
    });

    return NextResponse.json(updated, { status: 200 });
}