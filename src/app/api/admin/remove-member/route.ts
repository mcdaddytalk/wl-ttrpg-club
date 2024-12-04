
import { removeUser } from "@/server/authActions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {

if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const body = await request.json();
  if (!body.memberId || !body.deletedBy) {
    return NextResponse.json({ message: `Member ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();
  try {
    await removeUser(body.memberId);

    const { error: memberError } = await supabase
    .from('members')
    .update({
        'deleted_at': new Date().toISOString(),
        'deleted_by': body.deletedBy
    })
    .eq('id', body.member_id)

    if (memberError) throw new Error(memberError.message);
 
    return NextResponse.json({ message: `Member removed` }, { status: 200 })  
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}