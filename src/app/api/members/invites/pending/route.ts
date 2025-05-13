import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import logger from '@/utils/logger';
import { InviteDO } from '@/lib/types/data-objects';
import { SupabaseGameInviteListResponse } from '@/lib/types/custom';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url)
  const summarize = searchParams.get('summarize') === 'true'

  let query = supabase
    .from('game_invites')
    .select(`
        *,
        invitee_member:members!game_invites_invitee_fkey(
            email,
            phone,
            profiles!inner(
                given_name,
                surname,
                avatar
            )
        ),
        game:games(
            title,
            cover_image
        ),
        gamemaster:members!game_invites_gamemaster_id_fkey(
                profiles!inner(
                    given_name,
                    surname,
                    avatar
                )
            ),
        invited_at
    `)
    .eq('invitee', user.id)
    .eq('accepted', false)
    .order('invited_at', { ascending: false })

  if (summarize) {
    query = query.limit(3)
  }

  const { data, error } = await query as unknown as SupabaseGameInviteListResponse;

  if (error) {
    logger.error(error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const invites: InviteDO[] = data.map((invite) => {
    return {
      id: invite.id,
      game_id: invite.game_id,
      invitee: invite.invitee,
      invitee_member: invite.invitee_member,
      display_name: invite.display_name,
      email: invite.external_email || invite.invitee_member?.email || '',
      phone: invite.external_phone || invite.invitee_member?.phone || '',
      invited_at: invite.invited_at,
      expires_at: invite.expires_at,
      viewed_at: invite.viewed_at,
      accepted_at: invite.accepted_at,
      accepted: invite.accepted,
      notified: invite.notified,
      game_title: invite.games.title,
      gm_id: invite.gamemaster_id,
      gm_name: `${invite.gamemaster.profiles.given_name} ${invite.gamemaster!.profiles.surname}`,
    }
  }) || []

  return NextResponse.json(invites);
}
