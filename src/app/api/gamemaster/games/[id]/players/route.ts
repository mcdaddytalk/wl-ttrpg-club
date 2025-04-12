import { GMGamePlayerDO } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> } ): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
      const { data: member } = await supabase
        .from("members")
        .select("id")
        .eq('id', user.id)
        .maybeSingle();
    
      if (!member) return NextResponse.json({ message: "Member not found" }, { status: 403 });
    
      const { data, error } = await supabase
        .from("game_registrations")
        .select(`
            member_id, 
            game_id, 
            registered_at, 
            status, 
            status_note, 
            members!fk_game_registrations_members(
                email, 
                profiles(
                    given_name,
                    surname
                )
            )
        `)
        .eq("game_id", id);
    
      if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    
      const result: GMGamePlayerDO[] = (data ?? []).map((r) => ({
        member_id: r.member_id,
        game_id: r.game_id,
        registered_at: r.registered_at,
        status: r.status,
        status_note: r.status_note,
        email: r.members?.email,
        profiles: r.members?.profiles,
      }));
    
      return NextResponse.json(result);
}  