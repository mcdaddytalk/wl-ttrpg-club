import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type InviteParams = {
    invite_id: string;
  };
  
  export async function POST(request: NextRequest, { params }: { params: Promise<InviteParams> } ): Promise<NextResponse> {
  
    if (request.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
  
    const { invite_id } = await params;
    if (!invite_id) {
      return NextResponse.json({ message: 'Invalid invite ID' }, { status: 400 });
    }
  
  const supabase = await createSupabaseServerClient();  

  const { error } = await supabase
    .from("game_invites")
    .update({ viewed_at: new Date().toISOString() })
    .eq("id", invite_id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Invite viewed" });
}
