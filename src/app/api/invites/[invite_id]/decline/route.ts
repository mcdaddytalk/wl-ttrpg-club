import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

type InviteParams = {
    invite_id: string;
  };
  
  export async function DELETE(request: NextRequest, { params }: { params: Promise<InviteParams> } ): Promise<NextResponse> {
  if (request.method !== 'DELETE') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { invite_id } = await params;
  if (!invite_id) {
    return NextResponse.json({ message: 'Invalid invite ID' }, { status: 400 });
  }

  const { error } = await supabase
    .from('game_invites')
    .delete()
    .eq('id', invite_id)
    .eq('invitee', user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Invite declined and removed' });
}
