import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

import logger from "@/utils/logger";
import { SupabaseGameInviteResponse } from "@/lib/types/custom";
import { getInitialSession } from "@/server/authActions";
import { logAuditEvent } from "@/server/auditTrail";

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

    const session = await getInitialSession();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { user } = session;
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

  const supabase = await createSupabaseServerClient();

  const { data: inviteData, error: inviteError } = await supabase
    .from('game_invites')
    .select('id, game_id, invitee, external_email, external_phone, expires_at, accepted, gamemaster_id')
    .eq('id', invite_id)
    .single() as unknown as SupabaseGameInviteResponse;

  if (inviteError || !inviteData) {
    logger.error(inviteError);
    return NextResponse.json({ message: 'Invite not found' }, { status: 404 });
  }
  
  // Check if expired
  const expiresAt = inviteData.expires_at;

  if (expiresAt !== null) {
    const expires = new Date(expiresAt);

    if (!isNaN(expires.getTime()) && expires < new Date()) {
      return NextResponse.json({ message: "Invite has expired" }, { status: 400 });
    }
  }

  logger.log('Invite accepted:', inviteData);
  logger.log('UserID:  ', user.id);

  // If this was an external invite, link it to the new member
  if (inviteData.external_email || inviteData.external_phone) {
    logger.log('Linking invite to user id from email: ', inviteData.external_email);
    const { data: linkData, error: linkError } = await supabase
      .from("game_invites")
      .update({ invitee: user.id, external_email: null, external_phone: null })
      .eq("id", invite_id)
      .select("*").single(); // Debugging

    logger.log("Updated Invite Rows:", linkData);

    if (linkError) {
      logger.error(linkError);
      return NextResponse.json({ error: "Failed to link invite" }, { status: 500 });
    }
  }

  if (inviteData.accepted) return NextResponse.json({ message: "Invite already accepted." });

  // Mark invite as accepted
  const { data: acceptData, error: acceptError } = await supabase
    .from("game_invites")
    .update({ 
      accepted: true,
      accepted_at: new Date().toISOString() 
    })
    .eq("id", invite_id)
    .select("*").single();

  logger.log("Updated Acceptance in Invite Rows:", acceptData);

  if (acceptError) {
    logger.error(acceptError);
    return NextResponse.json({ error: "Failed to accept invite" }, { status: 500 });
  }

  // Check if user is already registered for the game
  const { data: existingReg } = await supabase
    .from('game_registrations')
    .select('id')
    .eq('game_id', inviteData.game_id)
    .eq('member_id', user.id)
    .single();

    if (existingReg) {
      // Still update the invite to reflect acceptance
      await supabase
        .from("game_invites")
        .update({
          accepted: true,
          accepted_at: new Date().toISOString()
        })
        .eq("id", invite_id);
    
      return NextResponse.json({
        message: "You were already registered — invite marked as accepted.",
        game_id: inviteData.game_id
      });
    }


  // Register user for the game
  const { error: regError } = await supabase
    .from("game_registrations")
    .insert([
        { game_id: inviteData.game_id, member_id: user.id, status: "approved", status_note: "By Invite", updated_by: user.id },
    ]);

  if (regError) {
    logger.error(regError);
    return NextResponse.json({ error: "Failed to join game" }, { status: 500 });
  }

  // Remove invite
  // await supabase.from("game_invites").delete().eq("id", invite_id);

  await logAuditEvent({
    action: "accept",
    actor_id: user.id,
    target_type: "game_invite",
    target_id: invite_id,
    summary: `Joined game ${inviteData.game_id}`,
    metadata: {
      game_id: inviteData.game_id,
      gamemaster_id: inviteData.gamemaster_id,
      invitee_id: user.id,
      invitee_email: user.email,
      invitee_name: inviteData.display_name
    }
  })

  return NextResponse.json({ message: "Successfully joined game!", game_id: inviteData.game_id }, { status: 200 });
}